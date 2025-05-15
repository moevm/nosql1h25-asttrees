import {useLocation, useParams} from "react-router-dom";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb.tsx";
import {UserIcon} from "lucide-react";

function RepoViewPage(){
    const popa = useParams()['']
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className="p-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`${path}`}>
                            <UserIcon/><span>{path}</span>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default RepoViewPage;