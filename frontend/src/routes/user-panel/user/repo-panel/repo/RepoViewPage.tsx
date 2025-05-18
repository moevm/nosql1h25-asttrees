import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {Package, Settings, UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {
    $currentUser,
    $currentUserRepos,
    $repoId,
    $userCurrentRepo, type ApiRepositoryViewModel,
} from "@/store/store.ts";
import RepoFileTable from "@/routes/user-panel/user/repo-panel/repo/components/RepoFileTable.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import React from "react";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import UserRepoSettingsDialog from "@/components/dialogs/UserRepoSettingsDialog.tsx";

function RepoViewPage() {
    const repoId = useAtomValue($repoId)!
    const currentUser = useAtomValue($currentUser)!
    const currentUserRepos = useAtomValue($currentUserRepos)!
    const curRepo = useAtomValue($userCurrentRepo)!

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
        <BatchLoader states={[currentUser, currentUserRepos, curRepo]} loadingMessage={"Загрузка репозитория"} display={
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
                                    <BreadcrumbPage>
                                        <div className="flex items-center justify-between gap-1">
                                            <Package/>
                                            <Label>{repoId}</Label>
                                        </div>
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Settings/> Настройки
                                    </Button>
                                </DialogTrigger>
                                <UserRepoSettingsDialog repo={curRepo?.data as ApiRepositoryViewModel}/>
                            </Dialog>
                        </div>
                    </div>


                    <RepoFileTable data={curRepo?.data as ApiRepositoryViewModel}/>


                </div>
        }></BatchLoader>
    )
}

export default RepoViewPage;