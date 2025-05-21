import {loaded} from "@/api";
import UserTableView from "@/routes/admin-panel/users/components/UsersTableView.tsx";
import {$users} from "@/store/store.ts";
import {useAtomValue} from "jotai/react";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {Label} from "@/components/ui/label.tsx";

function UsersPage() {
    const users = useAtomValue($users);

    return (
        <BatchLoader states={[users]}
                     loadingMessage={"Загрузка пользователей"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Пользователи</Label>
                             <UserTableView data={loaded(users).data}></UserTableView>
                         </div>
                     }/>
    );
}

export default UsersPage;
