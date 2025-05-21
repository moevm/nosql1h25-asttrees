import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import CommitsTableView from "@/routes/admin-panel/commits/components/AdminCommitsTableView.tsx";
import {Label} from "@/components/ui/label.tsx";

function AdminCommitsPage() {

    return (
        <BatchLoader states={[]}
                     loadingMessage={"Загрузка коммитов"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Коммиты</Label>
                             <CommitsTableView></CommitsTableView>
                         </div>
                     }
        />
    );
}

export default AdminCommitsPage;
