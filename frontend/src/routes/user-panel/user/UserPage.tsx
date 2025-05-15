import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb.tsx";
import {useLocation} from "react-router-dom";
import {UserIcon} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import RepoList from "@/routes/user-panel/user/RepoList.tsx";
import {Input} from "@/components/ui/input.tsx";

function UserPage () {
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className="p-10 flex justify-between gap-4 flex-col">
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`${path}`}>
                                <div className={"flex justify-between items-center text-black"}>
                                    <UserIcon/><Label>{path}</Label>
                                </div>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <RepoList/>
        </div>
    )
}

export default UserPage;