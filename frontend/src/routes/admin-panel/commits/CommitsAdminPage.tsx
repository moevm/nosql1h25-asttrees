import {useAtomValue} from "jotai/react";
import {$commits} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import CommitsTableView from "@/routes/admin-panel/commits/components/CommitsAdminTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function CommitsAdminPage() {
    const commits = useAtomValue($commits);

    return (
        <BatchLoader states={[commits]}
                     loadingMessage={"Загрузка коммитов"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Коммиты</Label>
                             <CommitsTableView data={loaded(commits).data}></CommitsTableView>
                         </div>
                     }
        />
    );
}

export default CommitsAdminPage;
