import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage
} from "@/components/ui/breadcrumb.tsx";
import {UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {$currentUser} from "@/store/store.ts";
import RepoList from "@/routes/user-panel/user/components/RepoList.tsx";
import {Label} from "@/components/ui/label.tsx";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";

function UserPage () {
    const currentUser = useAtomValue($currentUser)!

    return (
        <div className="p-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <BatchLoader states={[currentUser]} loadingMessage={"Загрузка"} display={() => (
                                <div className="flex items-center justify-between">
                                    <UserIcon/>
                                    <Label>{loaded(currentUser).data.username}</Label>
                                </div>
                            )}>
                            </BatchLoader>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <RepoList/>


        </div>
    )
}

export default UserPage;