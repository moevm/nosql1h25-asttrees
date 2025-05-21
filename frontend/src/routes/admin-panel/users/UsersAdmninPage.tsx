import {loaded} from "@/api";
import UsersAdminTableView from "@/routes/admin-panel/users/components/UsersAdminTableView.tsx";
import {$users} from "@/store/store.ts";
import {useAtomValue} from "jotai/react";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {Label} from "@/components/ui/label.tsx";

function UsersAdmninPage() {
    const users = useAtomValue($users);

    return (
        <BatchLoader states={[users]}
                     loadingMessage={"Загрузка пользователей"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Пользователи</Label>
                             <UsersAdminTableView data={loaded(users).data}></UsersAdminTableView>
                         </div>
                     }/>
    );
}

export default UsersAdmninPage;
