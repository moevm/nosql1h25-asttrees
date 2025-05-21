import {useAtomValue} from "jotai/react";
import {$repos} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import ReposTableView from "@/routes/admin-panel/repos/components/ReposTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function ReposAdminPage() {
    const repos = useAtomValue($repos);

    return (
        <BatchLoader states={[repos]}
                     loadingMessage={"Загрузка репозиториев"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Репозитории</Label>
                             <ReposTableView data={loaded(repos).data}></ReposTableView>
                         </div>
                     }
        />
    );
}

export default ReposAdminPage;