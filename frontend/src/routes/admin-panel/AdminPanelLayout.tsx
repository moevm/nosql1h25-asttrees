import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/routes/admin-panel/components/AppSidebar.tsx";
import {Outlet, useNavigate, useSearchParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {$currentUser, $path} from "@/store/store.ts";
import {useEffect} from "react";
import {toast} from "sonner";

function AdminPanelLayout() {
    const currentUser = useAtomValue($currentUser)
    const navigate = useNavigate()

    useEffect(() => {
        console.info({
            currentUser
        })
        if ((currentUser.state === 'hasError') || (currentUser.state === 'hasData' && !currentUser.data.isAdmin)) {
            toast.error('Доступ запрещён')
            navigate('/')
        }
    }, [currentUser]);

    return (
        <div>
            <SidebarProvider>
                <AppSidebar/>
                <main>
                    <Outlet/>
                </main>
            </SidebarProvider>
        </div>
    )
}

export default AdminPanelLayout
