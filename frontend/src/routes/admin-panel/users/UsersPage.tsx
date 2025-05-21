import {loaded} from "@/api";
import UserTableView from "@/routes/admin-panel/users/components/UsersTableView.tsx";
import {$users} from "@/store/store.ts";
import {useAtomValue} from "jotai/react";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";

function UsersPage() {
    const users = useAtomValue($users);

    return (
        <BatchLoader states={[users]}
                     loadingMessage={"Загрузка пользователей"}
                     display={() =>
                         <div className={"flex flex-col m-6  py-4 ml-6"}>
                             <span className={"text-4xl"}>Пользователи</span>
                             <UserTableView data={loaded(users).data}></UserTableView>
                         </div>
                     }/>
    );
}

export default UsersPage;
