import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {$repoId, $userId} from "@/store.ts";
import {Label} from "@/components/ui/label.tsx";

function RepoViewPage() {
    const repoId = useAtomValue($repoId)!
    const userId = useAtomValue($userId)!

    return (
        <div className="p-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/users/${userId}`}>
                            <div className="flex items-center justify-between">
                                <UserIcon/>
                                <Label>{userId}</Label>
                            </div>

                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <span>{repoId}</span>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default RepoViewPage;