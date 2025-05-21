import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import AdminBranchesTableView from "@/routes/admin-panel/branches/components/AdminBranchesTableView.tsx";
import {Label} from "@/components/ui/label.tsx";
import React from "react";

function AdminBranchesPage () {

    return (
        <BatchLoader states={[]}
                     loadingMessage={"Загрузка репозиториев"}
                     display={() => (
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Ветки</Label>
                             <AdminBranchesTableView></AdminBranchesTableView>
                         </div>

                     )}/>
    );
}

export default AdminBranchesPage;