import {loaded} from "@/api";
import AdminUsersTableView from "@/routes/admin-panel/users/components/AdminUsersTableView.tsx";
import {$users} from "@/store/store.ts";
import {useAtomValue} from "jotai/react";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminUsersPage() {
    const users = useAtomValue($users);

    return (
        <BatchLoader states={[users]}
                     loadingMessage={"Загрузка пользователей"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Пользователи</Label>
                             <AdminUsersTableView data={loaded(users).data}></AdminUsersTableView>
                         </div>
                     }/>
    );
}

export default AdminUsersPage;
