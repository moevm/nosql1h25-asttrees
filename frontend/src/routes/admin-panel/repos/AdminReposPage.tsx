import {useAtomValue} from "jotai/react";
import {$repos} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import AdminReposTableView from "@/routes/admin-panel/repos/components/AdminReposTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminReposPage() {
    const repos = useAtomValue($repos);

    return (
        <BatchLoader states={[repos]}
                     loadingMessage={"Загрузка репозиториев"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Репозитории</Label>
                             <AdminReposTableView data={loaded(repos).data}></AdminReposTableView>
                         </div>
                     }
        />
    );
}

export default AdminReposPage;