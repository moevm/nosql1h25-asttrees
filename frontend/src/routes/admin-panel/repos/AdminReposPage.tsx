import AdminReposTableView from "@/routes/admin-panel/repos/components/AdminReposTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminReposPage() {

    return (
        <div className={"flex flex-col p-8"}>
            <Label className={"text-4xl"}>Репозитории</Label>
            <AdminReposTableView/>
        </div>
    );
}

export default AdminReposPage;