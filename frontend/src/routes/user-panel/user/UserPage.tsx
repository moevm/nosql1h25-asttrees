import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage
} from "@/components/ui/breadcrumb.tsx";
import {UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import RepoList from "@/routes/user-panel/user/components/RepoList.tsx";
import {Label} from "@/components/ui/label.tsx";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {$currentUser, $currentUserRepos} from "@/store/store.ts";
import {loaded} from "@/api";

function UserPage() {
    const currentUser = useAtomValue($currentUser)!
    const currentUserRepos = useAtomValue($currentUserRepos)!

    return (
        <BatchLoader states={[currentUser, currentUserRepos]} loadingMessage={"Загрузка пользователя"} display={
            () =>
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

                    <RepoList data={loaded(currentUserRepos).data}/>
                </div>
        }/>
    )
}

export default UserPage;