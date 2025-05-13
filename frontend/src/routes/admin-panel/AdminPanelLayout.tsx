import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/routes/admin-panel/components/AppSidebar.tsx";
import {Outlet} from "react-router-dom";

function AdminPanelLayout() {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar/>
                <Outlet/>
            </SidebarProvider>
        </div>
    )
}

export default AdminPanelLayout