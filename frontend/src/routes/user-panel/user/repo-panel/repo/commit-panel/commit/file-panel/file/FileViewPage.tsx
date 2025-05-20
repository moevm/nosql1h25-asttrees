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
import {$currentRepo, $fileAst, $fileContent} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import FileTable
    from "@/routes/user-panel/user/repo-panel/repo/commit-panel/commit/file-panel/file/components/FileTable.tsx";
import {loaded} from "@/api";

function FileViewPage() {

    const currentRepo = useAtomValue($currentRepo)!
    const fileContent = useAtomValue($fileContent)!
    const fileAst = useAtomValue($fileAst)!
    console.log(fileAst)

    return (
        <BatchLoader states={[currentRepo, fileContent, fileAst]} loadingMessage={"Загрузка репозитория"} display={
            () =>
                <div className="p-10 flex flex-col gap-2">
                    <div className={"flex justify-between"}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/users/${currentRepo.data.owner.id}`}>
                                        <div className="flex items-center justify-between gap-1">
                                            <UserIcon/>
                                            <Label>{currentRepo.data.owner.username}</Label>
                                        </div>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/users/${currentRepo.data.owner.id}/repo/${currentRepo.data.repository.id}/branch/${currentRepo.data.branch.id}/commit/${currentRepo.data.commit.id}`}>
                                        <div className="flex items-center justify-between gap-1">
                                            <Package/>
                                            <Label>{currentRepo.data.repository.name}</Label>
                                        </div>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
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

                    <FileTable repo={loaded(currentRepo).data!} fileContent={loaded(fileContent).data!}/>
                    {fileAst}
                </div>
        }></BatchLoader>
    )
}

export default FileViewPage;