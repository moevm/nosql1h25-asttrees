import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage
} from "@/components/ui/breadcrumb.tsx";
import {UserIcon} from "lucide-react";
import {useAtomValue} from "jotai/react";
import {$userId} from "@/store.ts";

function UserPage () {
    const userId = useAtomValue($userId)!

    return (
        <div className="p-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <UserIcon/><span>{userId}</span>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default UserPage;