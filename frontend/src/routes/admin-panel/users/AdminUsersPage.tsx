import AdminUsersTableView from "@/routes/admin-panel/users/components/AdminUsersTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminUsersPage() {
    return (
        <div className={"flex flex-col p-8"}>
            <Label className={"text-4xl"}>Пользователи</Label>
            <AdminUsersTableView/>
        </div>
    );
}

export default AdminUsersPage;
