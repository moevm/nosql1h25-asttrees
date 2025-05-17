import {useAtomValue} from "jotai/react";
import {$currentUser, $repoId} from "@/store.ts";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {History, Package, UserIcon} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import CommitTable from "@/routes/user-panel/user/repo-panel/repo/commit-history-panel/components/CommitTable.tsx";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";

function CommitHistoryViewPage() {
    const repoId = useAtomValue($repoId)!
    const currentUser = useAtomValue($currentUser)!

    const newCommits = [
        {
            id: "cmt-001",
            branch: "main",
            hash: "abc123def456",
            author: "Иван Иванов",
            email: "ivan@example.com",
            message: "Initial commit",
            filesChanged: 3,
            linesAdded: 120,
            linesRemoved: 10,
            createdAt: "2025-05-13T18:30:00.000Z",
            rootFiles: [
                {
                    Items: {
                        id: "file-001",
                        name: "src",
                        type: "DIRECTORY",
                        hash: "dir123",
                        commit: "abc123def456",
                        parent: null,
                    }
                },
                {
                    Items: {
                        id: "file-002",
                        name: "index.tsx",
                        type: "FILE",
                        hash: "filehash001",
                        commit: "abc123def456",
                        parent: "file-001",
                    }
                }
            ],
        },
        {
            id: "cmt-002",
            branch: "main",
            hash: "ghi789",
            author: "Иван1 Иванов2",
            email: "ivan1@example.com",
            message: "Initial commit2",
            filesChanged: 3,
            linesAdded: 120,
            linesRemoved: 10,
            createdAt: "2025-05-13T18:30:00.000Z",
            rootFiles: [
                {
                    Items: {
                        id: "file-001",
                        name: "src",
                        type: "DIRECTORY",
                        hash: "dir123",
                        commit: "abc123def456",
                        parent: null,
                    }
                },
                {
                    Items: {
                        id: "file-002",
                        name: "index.tsx",
                        type: "FILE",
                        hash: "filehash001",
                        commit: "abc123def456",
                        parent: "file-001",
                    }
                }
            ],
        }
    ]

    return (
        <BatchLoader states={[currentUser]} loadingMessage={"Загрузка пользователя"} display={
            () =>
                <div className="p-10 flex flex-col gap-2">
                    <div className={"flex justify-between"}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/users/${currentUser.data.id}`}>
                                        <div className="flex items-center justify-between gap-1">
                                            <UserIcon/>
                                            <Label>{currentUser.data.username}</Label>
                                        </div>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/users/${currentUser.data.id}/repo/${repoId}`}>
                                        <div className="flex items-center justify-between gap-1">
                                            <Package/>
                                            <Label>{repoId}</Label>
                                        </div>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        <div className="flex items-center justify-between gap-1">
                                            <History/>
                                            <Label>История коммитов</Label>
                                        </div>
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <CommitTable data={newCommits}/>
                </div>
        }></BatchLoader>
    )
}

export default CommitHistoryViewPage