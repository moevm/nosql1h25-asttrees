import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/routes/admin-panel/components/AppSidebar.tsx";
import {Outlet} from "react-router-dom";

function AdminPanelLayout() {
    return (
        <div className="">
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