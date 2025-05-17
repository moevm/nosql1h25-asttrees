package ru.sweetgit.backend.service;

import jakarta.annotation.Nullable;
import lombok.SneakyThrows;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.diff.*;
import org.eclipse.jgit.errors.LargeObjectException;
import org.eclipse.jgit.errors.MissingObjectException;
import org.eclipse.jgit.lib.*;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevTree;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.eclipse.jgit.util.io.DisabledOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.util.Pair;
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
public class GitService {
    private final Logger logger = LoggerFactory.getLogger(GitService.class);

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
                .setCloneAllBranches(true)
                .setNoTags()
                .call();
             var repo = git.getRepository();
             var reader = repo.newObjectReader()
        ) {
            var commitIds = new HashSet<ObjectId>();
            var branches = git.branchList().setListMode(null).call();

            try (var revWalk = new RevWalk(repo)) {
                for (var ref : branches) {
                    try {
                        revWalk.markStart(revWalk.parseCommit(ref.getObjectId()));
                    } catch (Exception e) {
                        logger.error("Could not parse commit for ref: {} - {}", ref.getName(), e.getMessage());
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
                        fileStats = getRepoFileStats(repo, reader, parent.getTree(), commit.getTree());
                    } else {
                        fileStats = getRepoFileStats(repo, reader, null, commit.getTree());
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
                var fullBranchName = branchRef.getName();
                var shortBranchName = Repository.shortenRefName(fullBranchName);

                var branchModelBuilder = BranchModel.builder()
                        .name(shortBranchName)
                        .createdAt(Instant.now()); // TODO find first commit

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
            FileUtil.deleteDirectoryRecursively(repoDir);
        }

        return new ImportRepositoryResult(
                repoModelBuilder,
                branchData,
                commitData,
                relations
        );
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
            RevTree newTree
    ) {
        var stats = new RepoFileStats();

        try (DiffFormatter diffFormatter = new DiffFormatter(DisabledOutputStream.INSTANCE)) {
            diffFormatter.setRepository(repository);
            diffFormatter.setReader(reader, new Config());
            diffFormatter.setDiffComparator(RawTextComparator.DEFAULT);
            diffFormatter.setDetectRenames(true);

            var diffs = diffFormatter.scan(oldTree, newTree);
            stats.filesChanged = diffs.size();

            for (DiffEntry diff : diffs) {
                boolean isOldVersionBinary = false;
                if (oldTree != null && diff.getOldId() != null && !diff.getOldId().toObjectId().equals(ObjectId.zeroId())) {
                    isOldVersionBinary = isLikelyBinary(reader, diff.getOldId().toObjectId());
                }
                boolean isNewVersionBinary = false;
                if (diff.getNewId() != null && !diff.getNewId().toObjectId().equals(ObjectId.zeroId())) {
                    isNewVersionBinary = isLikelyBinary(reader, diff.getNewId().toObjectId());
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
                        stats.linesAdded += getBlobMetadata(reader, diff.getNewId().toObjectId()).getLines();
                        break;
                    case DELETE:
                        stats.linesRemoved += getBlobMetadata(reader, diff.getOldId().toObjectId()).getLines();
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
                CommitFileModel.CommitFileModelBuilder commitFileModelBuilder;
                if (fileMode.equals(FileMode.REGULAR_FILE) ||
                        fileMode.equals(FileMode.EXECUTABLE_FILE)) {

                    var blobId = treeWalk.getObjectId(0);
                    var metadata = getBlobMetadata(reader, blobId);

                    commitFileModelBuilder = CommitFileModel.builder()
                            .name(treeWalk.getNameString())
                            .fullPath(treeWalk.getPathString())
                            .hash(blobId.name())
                            .type(FileTypeModel.FILE)
                            .metadata(metadata);
                } else if (fileMode.equals(FileMode.TREE)) {
                    commitFileModelBuilder = CommitFileModel.builder()
                            .name(treeWalk.getNameString())
                            .fullPath(treeWalk.getPathString())
                            .type(FileTypeModel.DIRECTORY);
                } else {
                    continue;
                }

                stats.files.add(new FileData(
                        commitFileModelBuilder,
                        null
                ));
            }
        }

        return stats;
    }

    @SneakyThrows
    private CommitFileMetadataModel getBlobMetadata(ObjectReader objectReader, ObjectId blobId) {
        if (blobId == null || blobId.equals(ObjectId.zeroId())) {
            return new CommitFileMetadataModel(0, 0L, false);
        }
        var isFileBinary = isLikelyBinary(objectReader, blobId);
        var loader = objectReader.open(blobId, Constants.OBJ_BLOB);
        if (isFileBinary) {
            return new CommitFileMetadataModel(1, loader.getSize(), true);
        }

        try (var inputStream = loader.openStream();
             var bufferedReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            return new CommitFileMetadataModel(
                    (int) bufferedReader.lines().count(),
                    loader.getSize(),
                    false
            );
        } catch (LargeObjectException | MissingObjectException e) {
            return new CommitFileMetadataModel(0, 0L, false);
        }
    }

    @SneakyThrows
    private boolean isLikelyBinary(ObjectReader objectReader, AnyObjectId blobId) {
        if (blobId == null || blobId.equals(ObjectId.zeroId())) {
            return false;
        }
        try {
            var loader = objectReader.open(blobId.toObjectId(), Constants.OBJ_BLOB);
            if (loader.isLarge()) {
                byte[] prefix = loader.getCachedBytes(8000);
                return RawText.isBinary(prefix);
            }
            var bytes = loader.getBytes();
            return RawText.isBinary(bytes);
        } catch (MissingObjectException e) {
            return false;
        }
    }
}
