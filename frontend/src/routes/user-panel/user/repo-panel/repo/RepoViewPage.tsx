import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {Folder, Package, Settings, UserIcon} from "lucide-react";
import {useAtomValue, useSetAtom} from "jotai/react";
import {
    $currentRepo, $path, type ApiRepositoryModel, type ApiRepositoryViewModel, $showRepoSettingsDialog
} from "@/store/store.ts";
import RepoFileTable from "@/routes/user-panel/user/repo-panel/repo/components/RepoFileTable.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import React from "react";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import UserRepoSettingsDialog from "@/components/dialogs/UserRepoSettingsDialog.tsx";
import {Link} from "react-router-dom";

function RepoViewPage() {
    const showRepoSettingsDialog = useAtomValue($showRepoSettingsDialog);
    const setShowRepoSettingsDialog = useSetAtom($showRepoSettingsDialog);

    const currentRepo = useAtomValue($currentRepo)!
    const path = useAtomValue($path)!

    return (
        <BatchLoader states={[currentRepo]} loadingMessage={"Загрузка репозитория"} display={
            () =>
                <div className="p-10 flex flex-col gap-2">
                    <div className={"flex justify-between"}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link className="flex items-center justify-between gap-1"
                                              to={`/users/${currentRepo.data.owner.id}`}>
                                            <UserIcon/>
                                            <Label>{currentRepo.data.owner.username}</Label>
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link className="flex items-center justify-between gap-1"
                                              to={`/users/${currentRepo.data.owner.id}/repo/${currentRepo.data.repository.id}/branch/${currentRepo.data.branch.id}/commit/${currentRepo.data.commit.id}`}>
                                            <Package/>
                                            <Label>{currentRepo.data.repository.name}</Label>
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                {path && path !== "" && (
                                    <>
                                        <BreadcrumbSeparator/>
                                        {path.split('/').map((segment, index) => (
                                            <React.Fragment key={index}>
                                                {index > 0 && <BreadcrumbSeparator/>}
                                                <BreadcrumbItem>
                                                    {index === path.split('/').length - 1 ? (
                                                        <BreadcrumbPage>
                                                            <div className="flex items-center justify-between gap-1">
                                                                <Folder/>
                                                                <Label>{segment}</Label>
                                                            </div>
                                                        </BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink
                                                            asChild
                                                        >
                                                            <Link className="flex items-center justify-between gap-1"
                                                                  to={`/users/${currentRepo.data.owner.id}/repo/${currentRepo.data.repository.id}/branch/${currentRepo.data.branch.id}/commit/${currentRepo.data.commit.id}?path=${path.split('/').slice(0, index + 1).join('/')}`}>
                                                                <Folder/>
                                                                <Label>{segment}</Label>
                                                            </Link>
                                                        </BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                            </React.Fragment>
                                        ))}
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div>
                            <Dialog open={showRepoSettingsDialog} onOpenChange={setShowRepoSettingsDialog}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Settings/> Настройки
                                    </Button>
                                </DialogTrigger>
                                <UserRepoSettingsDialog repo={currentRepo?.data?.repository as ApiRepositoryModel}/>
                            </Dialog>
                        </div>
                    </div>


                    <RepoFileTable data={currentRepo?.data as ApiRepositoryViewModel}/>


                </div>
        }></BatchLoader>
    )
}

export default RepoViewPage;
