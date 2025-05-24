import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/routes/admin-panel/components/AppSidebar.tsx";
import {Outlet, useNavigate, useSearchParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {$currentUser, $path} from "@/store/store.ts";
import {useEffect, useMemo} from "react";
import {toast} from "sonner";
import {$authToken} from "@/api";

function AdminPanelLayout() {
    const currentUser = useAtomValue($currentUser)
    const authToken = useAtomValue($authToken)
    const navigate = useNavigate()

    const currentUserIsAdmin = useMemo(() => {
        return ((currentUser.state === 'loading') || (currentUser.state === 'hasData' && currentUser.data.isAdmin)) && authToken !== null
    }, [currentUser, authToken])

    useEffect(() => {
        if (!currentUserIsAdmin) {
            toast.error('Доступ запрещён')
            navigate('/')
        }
    }, [currentUserIsAdmin]);

    return (
        <div>
            <SidebarProvider>
                <AppSidebar/>
                <main className={"flex-1 min-w-0"}>
                    <Outlet/>
                </main>
            </SidebarProvider>
        </div>
    )
}

export default AdminPanelLayout
