import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage
} from "@/components/ui/breadcrumb.tsx";
import {UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {$userId} from "@/store.ts";
import RepoList from "@/routes/user-panel/user/components/RepoList.tsx";
import {Label} from "@/components/ui/label.tsx";

function UserPage () {
    const userId = useAtomValue($userId)!

    return (
        <div className="p-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <div className="flex items-center justify-between">
                                <UserIcon/>
                                <Label>{userId}</Label>
                            </div>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <RepoList/>


        </div>
    )
}

export default UserPage;