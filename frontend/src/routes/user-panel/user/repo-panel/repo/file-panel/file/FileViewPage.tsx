import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {File, Package, UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {Label} from "@/components/ui/label.tsx";
import FileTable from "@/routes/user-panel/user/repo-panel/repo/file-panel/file/components/FileTable.tsx";
import {$currentUser, $fileId, $repoId, type ApiCommitModel} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";

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

function FileViewPage() {
    const repoId = useAtomValue($repoId)!
    const currentUser = useAtomValue($currentUser)!
    const fileId = useAtomValue($fileId)!

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
                                            <File/>
                                            <Label>{fileId}</Label>
                                        </div>
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <FileTable data={mockCommits as ApiCommitModel}/>
                </div>
        }></BatchLoader>
    )
}

export default FileViewPage;