import AdminUsersTableView from "@/routes/admin-panel/users/components/AdminUsersTableView.tsx";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminUsersPage() {

    return (
        <BatchLoader states={[]}
                     loadingMessage={"Загрузка пользователей"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Пользователи</Label>
                             <AdminUsersTableView></AdminUsersTableView>
                         </div>
                     }/>
    );
}

export default AdminUsersPage;
