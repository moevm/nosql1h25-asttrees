import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import {useAtomValue} from "jotai/react";
import {$branches} from "@/store/store.ts";
import BranchesAdminPage from "@/routes/admin-panel/branches/components/BranchesAdminPage.tsx";

function BranchesPage () {
    const branches = useAtomValue($branches);

    return (
        <BatchLoader states={[branches]}
                     loadingMessage={"Загрузка репозиториев"}
                     display={() => <BranchesAdminPage data={loaded(branches).data}></BranchesAdminPage>}/>
    );
}

export default BranchesPage;