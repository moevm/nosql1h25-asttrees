import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {Package, UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {$repoId, $userId} from "@/store.ts";
import RepoFileTable from "@/routes/user-panel/user/repo-panel/repo/components/RepoFileTable.tsx";

function RepoViewPage() {
    const repoId = useAtomValue($repoId)!
    const userId = useAtomValue($userId)!
    const sttt = [
        "aaa",
        "bbb",
        "ccc"
    ]

    return (
        <div className="p-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/users/${userId}`}>
                            <UserIcon/><span>{userId}</span>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <Package/> <span>{repoId}</span>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <RepoFileTable data={sttt}/>



        </div>
    )
}

export default RepoViewPage;