import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import AdminReposTableView from "@/routes/admin-panel/repos/components/AdminReposTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminReposPage() {

    return (
        <BatchLoader states={[]}
                     loadingMessage={"Загрузка репозиториев"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Репозитории</Label>
                             <AdminReposTableView></AdminReposTableView>
                         </div>
                     }
        />
    );
}

export default AdminReposPage;