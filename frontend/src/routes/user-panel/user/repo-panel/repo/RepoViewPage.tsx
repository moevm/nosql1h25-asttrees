import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {BoxIcon, Package, UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {$repoId, $userId} from "@/store.ts";
import RepoFileTable from "@/routes/user-panel/user/repo-panel/repo/components/RepoFileTable.tsx";
import {Label} from "@/components/ui/label.tsx";
import type {RepoFileProps} from "@/types/RepoFileProps.ts";

function RepoViewPage() {
    const repoId = useAtomValue($repoId)!
    const userId = useAtomValue($userId)!

    const mockCommits = [
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
        }
    ]

    return (
        <div className="p-10 flex flex-col gap-2">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/users/${userId}`}>
                            <div className="flex items-center justify-between gap-1">
                                <UserIcon/>
                                <Label>{userId}</Label>
                            </div>

                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <div className="flex items-center justify-between gap-1">
                                <Package/>
                                <Label>{repoId}</Label>
                            </div>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <RepoFileTable data={mockCommits as RepoFileProps}/>



        </div>
    )
}

export default RepoViewPage;