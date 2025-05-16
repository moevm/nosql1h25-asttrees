import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {BoxIcon, Package, Settings, UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {$repoId, $userId} from "@/store.ts";
import RepoFileTable from "@/routes/user-panel/user/repo-panel/repo/components/RepoFileTable.tsx";
import {Label} from "@/components/ui/label.tsx";
import type {RepoFileProps} from "@/types/RepoFileProps.ts";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import UserRepoSettingsDialog from "@/components/dialogs/UserRepoSettingsDialog.tsx";

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
            <div className={"flex justify-between"}>
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

                 {/*TODO: получаем по id репо и передаем в диалог*/}
                {/*<div>*/}
                {/*    <Dialog>*/}
                {/*        <DialogTrigger asChild>*/}
                {/*            <Button variant="ghost">*/}
                {/*                Редактировать*/}
                {/*            </Button>*/}
                {/*        </DialogTrigger>*/}
                {/*        <UserRepoSettingsDialog repo={repo}/>*/}
                {/*    </Dialog>*/}
                {/*</div>*/}
                <div>
                    <Button onClick={() => {
                        console.log("Потом)")}}>
                        <Settings/> Настройки
                    </Button>
                </div>
            </div>


            <RepoFileTable data={mockCommits as RepoFileProps}/>


        </div>
    )
}

export default RepoViewPage;