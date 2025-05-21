import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import {useAtomValue} from "jotai/react";
import {$branches} from "@/store/store.ts";
import AdminBranchesTableView from "@/routes/admin-panel/branches/components/AdminBranchesTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminBranchesPage () {
    const branches = useAtomValue($branches);

    return (
        <BatchLoader states={[branches]}
                     loadingMessage={"Загрузка репозиториев"}
                     display={() => (
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Ветки</Label>
                             <AdminBranchesTableView data={loaded(branches).data}></AdminBranchesTableView>
                         </div>

                     )}/>
    );
}

export default AdminBranchesPage;