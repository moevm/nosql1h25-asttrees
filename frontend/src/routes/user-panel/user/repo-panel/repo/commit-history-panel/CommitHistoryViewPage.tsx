import {useAtomValue} from "jotai/react";
import {$branchCommits, $currentRepo} from "@/store/store.ts";
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
import {loaded} from "@/api";
import {Link} from "react-router-dom";

function CommitHistoryViewPage() {
    const currentRepo = useAtomValue($currentRepo)!
    const branchCommits = useAtomValue($branchCommits)!

    return (
        <BatchLoader states={[currentRepo, branchCommits]} loadingMessage={"Загрузка репозитория"} display={
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

                    <CommitTable repo={loaded(currentRepo).data!} data={loaded(branchCommits).data!}/>
                </div>
        }></BatchLoader>
    )
}

export default CommitHistoryViewPage
