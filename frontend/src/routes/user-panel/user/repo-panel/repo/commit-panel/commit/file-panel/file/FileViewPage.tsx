import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {File, Folder, Package, UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {Label} from "@/components/ui/label.tsx";
import {$currentRepo, $fileAst, $fileContent} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import FileTable
    from "@/routes/user-panel/user/repo-panel/repo/commit-panel/commit/file-panel/file/components/FileTable.tsx";
import React from "react";
import {Link} from "react-router-dom";

function FileViewPage() {
    const currentRepo = useAtomValue($currentRepo)!
    const fileContent = useAtomValue($fileContent)!
    const fileAst = useAtomValue($fileAst)!

    return (
        <BatchLoader states={[currentRepo, fileContent]} loadingMessage={"Загрузка репозитория"} display={
            () =>
                <div className="p-10 flex flex-col gap-2">
                    <div className={"flex justify-between"}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link className="flex items-center justify-between gap-1" to={`/users/${currentRepo.data.owner.id}`}>
                                            <UserIcon/>
                                            <Label>{currentRepo.data.owner.username}</Label>
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        asChild
                                    >
                                        <Link className="flex items-center justify-between gap-1" to={`/users/${currentRepo.data.owner.id}/repo/${currentRepo.data.repository.id}/branch/${currentRepo.data.branch.id}/commit/${currentRepo.data.commit.id}`}>
                                            <Package/>
                                            <Label>{currentRepo.data.repository.name}</Label>
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {fileContent.data.commitFile.fullPath && fileContent.data.commitFile.fullPath !== "" && (
                                    <>
                                        {fileContent.data.commitFile.fullPath.split('/').slice(0, -1).length > 0 && <BreadcrumbSeparator />}
                                        {fileContent.data.commitFile.fullPath.split('/').slice(0, -1).map((segment, index) => (
                                            <React.Fragment key={index}>
                                                {index > 0 && <BreadcrumbSeparator />}
                                                <BreadcrumbItem>
                                                    <BreadcrumbLink
                                                        asChild
                                                    >
                                                        <Link className="flex items-center justify-between gap-1" to={`/users/${currentRepo.data.owner.id}/repo/${currentRepo.data.repository.id}/branch/${currentRepo.data.branch.id}/commit/${currentRepo.data.commit.id}?path=${fileContent.data.commitFile.fullPath.split('/').slice(0, index + 1).join('/')}`}>
                                                            <Folder />
                                                            <Label>{segment}</Label>
                                                        </Link>
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                            </React.Fragment>

                                            ))}
                                    </>
                                )}

                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        <div className="flex items-center justify-between gap-1">
                                            <File/>
                                            <Label>{fileContent.data.commitFile.name}</Label>
                                        </div>
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <FileTable
                        repo={currentRepo}
                        fileContent={fileContent}
                        fileAst={fileAst}
                    />
                </div>
        }></BatchLoader>
    )
}

export default FileViewPage;
