import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage
} from "@/components/ui/breadcrumb.tsx";
import {UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {$currentUser} from "@/store.ts";
import RepoList from "@/routes/user-panel/user/components/RepoList.tsx";
import {Label} from "@/components/ui/label.tsx";

function UserPage () {
    const currentUser = useAtomValue($currentUser)!

    return (
        <div className="p-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <div className="flex items-center justify-between">
                                <UserIcon/>
                                <Label>{currentUser.data.username}</Label>
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