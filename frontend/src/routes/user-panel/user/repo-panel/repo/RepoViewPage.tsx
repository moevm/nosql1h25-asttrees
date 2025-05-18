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
    $currentRepo, type ApiRepositoryViewModel,
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

    const currentRepo = useAtomValue($currentRepo)!

    return (
        <BatchLoader states={[currentUser, currentUserRepos, currentRepo]} loadingMessage={"Загрузка репозитория"} display={
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
                                <UserRepoSettingsDialog repo={currentRepo?.data as ApiRepositoryViewModel}/>
                            </Dialog>
                        </div>
                    </div>


                    <RepoFileTable data={currentRepo?.data as ApiRepositoryViewModel}/>


                </div>
        }></BatchLoader>
    )
}

export default RepoViewPage;