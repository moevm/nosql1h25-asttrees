package ru.sweetgit.backend.service;

import jakarta.annotation.Nullable;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.ListBranchCommand;
import org.eclipse.jgit.diff.*;
import org.eclipse.jgit.errors.LargeObjectException;
import org.eclipse.jgit.errors.MissingObjectException;
import org.eclipse.jgit.lib.*;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevTree;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.eclipse.jgit.util.io.DisabledOutputStream;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.util.FileUtil;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.*;

@Service
@Slf4j
public class GitService {

    private final Map<String, String> originalAuthorCache = new HashMap<>();

    public record ImportRepositoryResult(
            RepositoryModel.RepositoryModelBuilder repositoryData,
            Map<String, BranchModel.BranchModelBuilder> branchData,
            Map<String, CommitData> commitData,
            List<Pair<String, String>> relations
    ) {
    }

    public record CommitData(
            CommitModel.CommitModelBuilder commitModelBuilder,
            List<FileData> files
    ) {
    }

    public record FileData(
            CommitFileModel.CommitFileModelBuilder entityBuilder,
            @Nullable byte[] data
    ) {
    }

    @SneakyThrows
    public ImportRepositoryResult importRepository(String name, URI link) {
        Path repoDir = Files.createTempDirectory("sweetgit-repo");

        var repoModelBuilder = RepositoryModel.builder()
                .name(name)
                .createdAt(Instant.now())
                .originalLink(link.toString());
        var branchData = new HashMap<String, BranchModel.BranchModelBuilder>();
        var commitData = new HashMap<String, CommitData>();
        var relations = new ArrayList<Pair<String, String>>();

        try (var git = Git.cloneRepository()
                .setURI(link.toString())
                .setDirectory(repoDir.toFile())
                .setNoTags()
                .call();
             var repo = git.getRepository();
             var reader = repo.newObjectReader()
        ) {
            var commitIds = new HashSet<ObjectId>();
            var branches = git.branchList().setListMode(ListBranchCommand.ListMode.REMOTE).call();

            try (var revWalk = new RevWalk(repo)) {
                for (var ref : branches) {
                    try {
                        revWalk.markStart(revWalk.parseCommit(ref.getObjectId()));
                    } catch (Exception e) {
                        log.error("Could not parse commit for ref: {} - {}", ref.getName(), e.getMessage());
                    }
                }
                for (RevCommit jgitCommit : revWalk) {
                    commitIds.add(jgitCommit.getId());
                }
            }

            for (var commitId : commitIds) {
                try (RevWalk revWalk = new RevWalk(repo)) {
                    var commit = revWalk.parseCommit(commitId);
                    var commitModelBuilder = CommitModel
                            .builder()
                            .hash(commit.getName())
                            .author(commit.getAuthorIdent().getName())
                            .email(commit.getAuthorIdent().getEmailAddress())
                            .message(commit.getFullMessage())
                            .createdAt(commit.getAuthorIdent().getWhenAsInstant());

                    RepoFileStats fileStats;
                    if (commit.getParentCount() > 0) {
                        var parent = revWalk.parseCommit(commit.getParent(0).getId());
                        fileStats = getRepoFileStats(repo, reader, parent.getTree(), commit.getTree(), commit, git);
                    } else {
                        fileStats = getRepoFileStats(repo, reader, null, commit.getTree(), commit, git);
                    }

                    commitModelBuilder = commitModelBuilder
                            .filesChanged(fileStats.filesChanged)
                            .linesAdded(fileStats.linesAdded)
                            .linesRemoved(fileStats.linesRemoved);

                    commitData.put(
                            commit.getName(),
                            new CommitData(
                                    commitModelBuilder,
                                    fileStats.files
                            )
                    );
                }
            }

            var headRef = repo.exactRef(Constants.HEAD);
            var headObjectId = (headRef != null && headRef.isSymbolic()) ? headRef.getLeaf().getObjectId() : null;

            for (var branchRef : branches) {
                var shortBranchName = getActualBranchName(branchRef);

                var branchModelBuilder = BranchModel.builder()
                        .name(shortBranchName)
                        .createdAt(Instant.now());

                boolean isDefault;
                if (headObjectId != null && branchRef.getObjectId().equals(headObjectId)) {
                    isDefault = true;
                } else {
                    isDefault = shortBranchName.equals("main") || shortBranchName.equals("master");
                }

                branchModelBuilder = branchModelBuilder.isDefault(isDefault);
                branchData.put(shortBranchName, branchModelBuilder);

                try (var revWalk = new RevWalk(repo)) {
                    var branchTipCommit = revWalk.parseCommit(branchRef.getObjectId());
                    revWalk.markStart(branchTipCommit);
                    for (var commit : revWalk) {
                        var commitModel = commitData.get(commit.getName());
                        if (commitModel != null) {
                            relations.add(Pair.of(
                                    shortBranchName,
                                    commit.getName()
                            ));
                        }
                    }
                }

            }
        } finally {
            try {
                FileUtil.deleteDirectoryRecursively(repoDir);
            } catch (Exception ignored) {
            }
        }

        return new ImportRepositoryResult(
                repoModelBuilder,
                branchData,
                commitData,
                relations
        );
    }

    private String getActualBranchName(Ref ref) {
        return ref.getName().substring(ref.getName().lastIndexOf("/") + 1);
    }

    private static class RepoFileStats {
        int filesChanged = 0;
        int linesAdded = 0;
        int linesRemoved = 0;
        List<FileData> files = new ArrayList<>();
    }

    @SneakyThrows
    private RepoFileStats getRepoFileStats(
            Repository repository,
            ObjectReader reader,
            @Nullable RevTree oldTree,
            RevTree newTree,
            RevCommit currentCommitRev,
            Git git
    ) {
        var stats = new RepoFileStats();
        var collectedDirectoryPaths = new HashSet<String>();

        try (var diffFormatter = new DiffFormatter(DisabledOutputStream.INSTANCE)) {
            diffFormatter.setRepository(repository);
            diffFormatter.setReader(reader, new Config());
            diffFormatter.setDiffComparator(RawTextComparator.DEFAULT);
            diffFormatter.setDetectRenames(true);

            var diffs = diffFormatter.scan(oldTree, newTree);
            stats.filesChanged = diffs.size();

            for (DiffEntry diff : diffs) {
                boolean isOldVersionBinary = false;
                if (oldTree != null && diff.getOldId() != null && !diff.getOldId().toObjectId().equals(ObjectId.zeroId())) {
                    var loader = reader.open(diff.getOldId().toObjectId(), Constants.OBJ_BLOB);
                    isOldVersionBinary = RawText.isBinary(loader.getBytes());
                }
                boolean isNewVersionBinary = false;
                if (diff.getNewId() != null && !diff.getNewId().toObjectId().equals(ObjectId.zeroId())) {
                    var loader = reader.open(diff.getNewId().toObjectId(), Constants.OBJ_BLOB);
                    isNewVersionBinary = RawText.isBinary(loader.getBytes());
                }

                boolean skipLineCountingForThisDiffEntry = false;
                switch (diff.getChangeType()) {
                    case ADD:
                        if (isNewVersionBinary) skipLineCountingForThisDiffEntry = true;
                        break;
                    case DELETE:
                        if (isOldVersionBinary) skipLineCountingForThisDiffEntry = true;
                        break;
                    case MODIFY:
                    case COPY:
                    case RENAME:
                        if (isOldVersionBinary || isNewVersionBinary) skipLineCountingForThisDiffEntry = true;
                        break;
                }

                if (skipLineCountingForThisDiffEntry) {
                    continue;
                }

                var fileHeader = diffFormatter.toFileHeader(diff);
                var edits = fileHeader.toEditList();

                switch (diff.getChangeType()) {
                    case ADD:
                        stats.linesAdded += getBlobData(reader, diff.getNewId().toObjectId()).getKey().getLines();
                        break;
                    case DELETE:
                        stats.linesRemoved += getBlobData(reader, diff.getOldId().toObjectId()).getKey().getLines();
                        break;
                    case MODIFY:
                    case COPY:
                    case RENAME:
                        for (Edit edit : edits) {
                            stats.linesRemoved += edit.getEndA() - edit.getBeginA();
                            stats.linesAdded += edit.getEndB() - edit.getBeginB();
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        try (TreeWalk treeWalk = new TreeWalk(reader)) {
            treeWalk.addTree(newTree);
            treeWalk.setRecursive(true);

            while (treeWalk.next()) {
                var fileMode = treeWalk.getFileMode(0);

                if (fileMode.equals(FileMode.REGULAR_FILE) ||
                        fileMode.equals(FileMode.EXECUTABLE_FILE)) {

                    String filePathString = treeWalk.getPathString();

                    java.nio.file.Path nioPath = java.nio.file.Paths.get(filePathString);
                    java.nio.file.Path parentPath = nioPath.getParent();
                    while (parentPath != null) {
                        collectedDirectoryPaths.add(parentPath.toString().replace('\\', '/'));
                        parentPath = parentPath.getParent();
                    }

                    var blobId = treeWalk.getObjectId(0);
                    var metadata = getBlobData(reader, blobId);

                    var originalAuthor = findOriginalAuthor(git, filePathString);
                    var lastChangedAuthor = findLastChangedByAuthor(git, filePathString, currentCommitRev.getId());

                    CommitFileModel.CommitFileModelBuilder commitFileModelBuilder = CommitFileModel.builder()
                            .name(treeWalk.getNameString())
                            .fullPath(filePathString)
                            .hash(blobId.name())
                            .type(FileTypeModel.FILE)
                            .metadata(metadata.getKey())
                            .originalAuthor(originalAuthor)
                            .lastChangedBy(lastChangedAuthor);
                    byte[] data = metadata.getValue();

                    stats.files.add(new FileData(
                            commitFileModelBuilder,
                            data
                    ));
                }
            }
        }

        for (String dirFullPath : collectedDirectoryPaths) {
            java.nio.file.Path nioDirPath = java.nio.file.Paths.get(dirFullPath);
            String dirName = nioDirPath.getFileName() != null ? nioDirPath.getFileName().toString() : dirFullPath;

            CommitFileModel.CommitFileModelBuilder dirModelBuilder = CommitFileModel.builder()
                    .name(dirName)
                    .fullPath(dirFullPath)
                    .type(FileTypeModel.DIRECTORY)
                    .originalAuthor(null)
                    .lastChangedBy(null);

            stats.files.add(new FileData(
                    dirModelBuilder,
                    null
            ));
        }

        return stats;
    }

    @SneakyThrows
    private Pair<CommitFileMetadataModel, byte[]> getBlobData(ObjectReader objectReader, ObjectId blobId) {
        if (blobId == null || blobId.equals(ObjectId.zeroId())) {
            return Pair.of(new CommitFileMetadataModel(0, 0L, false), null);
        }

        var loader = objectReader.open(blobId, Constants.OBJ_BLOB);
        var bytes = loader.getBytes();
        var isFileBinary = RawText.isBinary(bytes);

        if (isFileBinary) {
            return Pair.of(new CommitFileMetadataModel(1, loader.getSize(), true), bytes);
        }

        try (var inputStream = loader.openStream();
             var bufferedReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            return Pair.of(new CommitFileMetadataModel(
                    (int) bufferedReader.lines().count(),
                    loader.getSize(),
                    false
            ), bytes);
        } catch (LargeObjectException | MissingObjectException e) {
            return Pair.of(new CommitFileMetadataModel(0, 0L, false), bytes);
        }
    }

    @SneakyThrows
    private String findOriginalAuthor(Git git, String filePath) {
        if (originalAuthorCache.containsKey(filePath)) {
            return originalAuthorCache.get(filePath);
        }
        String author = null;
        var log = git.log().addPath(filePath).call();
        RevCommit firstCommitInHistory = null;
        for (RevCommit rc : log) {
            firstCommitInHistory = rc;
        }
        if (firstCommitInHistory != null) {
            author = firstCommitInHistory.getAuthorIdent().getName();
        }
        originalAuthorCache.put(filePath, author);
        return author;
    }

    @SneakyThrows
    private String findLastChangedByAuthor(Git git, String filePath, ObjectId currentCommitObjectId) {
        try (var revWalk = new RevWalk(git.getRepository())) {
            var startCommit = revWalk.parseCommit(currentCommitObjectId);
            var logIterable = git.log()
                    .addPath(filePath)
                    .add(startCommit.getId())
                    .setMaxCount(1)
                    .call();
            var iterator = logIterable.iterator();
            if (iterator.hasNext()) {
                var lastChangeCommit = iterator.next();
                return lastChangeCommit.getAuthorIdent().getName();
            }
        } catch (org.eclipse.jgit.api.errors.GitAPIException | org.eclipse.jgit.errors.MissingObjectException ignored) {
        }
        return null;
    }
}
