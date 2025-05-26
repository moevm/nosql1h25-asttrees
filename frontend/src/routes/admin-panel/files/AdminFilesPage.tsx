import AdminFilesTableView from "@/routes/admin-panel/files/components/AdminFilesTableView.tsx";
import {Label} from "@/components/ui/label.tsx";
import React from "react";

function AdminFilesPage() {
    return (
        <>
            <div className={"flex flex-col p-8"}>
                <Label className={"text-4xl"}>Файлы</Label>
                <AdminFilesTableView/>
            </div>
        </>
    )
}

export default AdminFilesPage;
