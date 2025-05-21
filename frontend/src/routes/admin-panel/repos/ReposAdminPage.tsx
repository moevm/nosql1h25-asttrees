import {useAtomValue} from "jotai/react";
import {$repos} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import ReposTableView from "@/routes/admin-panel/repos/components/ReposTableView.tsx";

function ReposAdminPage() {
    const repos = useAtomValue($repos);

    return (
        <BatchLoader states={[repos]}
                     loadingMessage={"Загрузка репозиториев"}
                     display={() => <ReposTableView data={loaded(repos).data}></ReposTableView>}/>
    );
}

export default ReposAdminPage;