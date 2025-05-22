import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/routes/admin-panel/components/AppSidebar.tsx";
import {Outlet, useSearchParams} from "react-router-dom";
import {useSetAtom} from "jotai/react";
import {$path} from "@/store/store.ts";
import {useEffect} from "react";

function AdminPanelLayout() {

    const [searchParams, setSearchParams] = useSearchParams();
    const path = searchParams.get('path') ?? ''
    const setPath = useSetAtom($path)

    useEffect(() => {
        console.log(path)
        setPath(path)
    }, [setPath, path]);

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