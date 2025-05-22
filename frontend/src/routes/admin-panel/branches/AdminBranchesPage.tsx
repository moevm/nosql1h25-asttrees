import AdminBranchesTableView from "@/routes/admin-panel/branches/components/AdminBranchesTableView.tsx";
import {Label} from "@/components/ui/label.tsx";
import React from "react";
import EditBranchDialog from "@/components/dialogs/EditBranchDialog.tsx";
import {branchSchema} from "@/lib/formSchemas.ts";

function AdminBranchesPage() {
    const onSave = (data: z.infer<typeof branchSchema>) => {
        console.log("создание ветки", data)
    };

    return (
        <>
            <EditBranchDialog onSave={onSave}/>
            <div className={"flex flex-col p-8"}>
                <Label className={"text-4xl"}>Ветки</Label>
                <AdminBranchesTableView/>
            </div>
        </>
    );
}

export default AdminBranchesPage;