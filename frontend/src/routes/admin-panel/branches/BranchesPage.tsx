import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import {useAtomValue} from "jotai/react";
import {$branches} from "@/store/store.ts";
import BranchesAdminPage from "@/routes/admin-panel/branches/components/BranchesAdminPage.tsx";
import {Label} from "@/components/ui/label.tsx";

function BranchesPage () {
    const branches = useAtomValue($branches);

    return (
        <BatchLoader states={[branches]}
                     loadingMessage={"Загрузка репозиториев"}
                     display={() => (
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Ветки</Label>
                             <BranchesAdminPage data={loaded(branches).data}></BranchesAdminPage>
                         </div>

                     )}/>
    );
}

export default BranchesPage;