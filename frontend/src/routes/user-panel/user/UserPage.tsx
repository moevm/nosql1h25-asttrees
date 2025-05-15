import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb.tsx";
import {useLocation} from "react-router-dom";
import {UserIcon} from "lucide-react";

function UserPage () {
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

export default UserPage;