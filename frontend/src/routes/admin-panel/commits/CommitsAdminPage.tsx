import {useAtomValue} from "jotai/react";
import {$commits} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import CommitsTableView from "@/routes/admin-panel/commits/components/CommitsAdminTableView.tsx";

function CommitsAdminPage() {
    const commits = useAtomValue($commits);

    return (
        <BatchLoader states={[commits]}
                     loadingMessage={"Загрузка коммитов"}
                     display={() =>
                         <div className={"flex flex-col m-6  py-4 ml-6"}>
                             <span className={"text-4xl"}>Коммиты</span>
                             <CommitsTableView data={loaded(commits).data}></CommitsTableView>
                         </div>
                     }
        />
    );
}

export default CommitsAdminPage;
