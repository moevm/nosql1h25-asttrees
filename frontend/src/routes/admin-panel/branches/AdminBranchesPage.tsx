import AdminBranchesTableView from "@/routes/admin-panel/branches/components/AdminBranchesTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminBranchesPage() {

    return (
        <div className={"flex flex-col p-8"}>
            <Label className={"text-4xl"}>Ветки</Label>
            <AdminBranchesTableView/>
        </div>
    );
}

export default AdminBranchesPage;