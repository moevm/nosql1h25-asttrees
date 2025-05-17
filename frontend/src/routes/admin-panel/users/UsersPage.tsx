import {loaded} from "@/api";
import UserTableView from "@/routes/admin-panel/users/components/UsersTableView.tsx";
import {$users} from "@/store.ts";
import {useAtomValue} from "jotai/react";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";

function UsersPage() {
    const users = useAtomValue($users);

    return (
        <BatchLoader states={[users]}
                     loadingMessage={"Загрузка пользователей"}
                     display={() => <UserTableView data={loaded(users).data}></UserTableView>}/>
    );
}

export default UsersPage;
