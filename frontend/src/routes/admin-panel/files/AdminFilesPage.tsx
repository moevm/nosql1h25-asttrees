import AdminFilesTableView, {generateMockFiles} from "@/routes/admin-panel/files/components/AdminFilesTableView.tsx";
import {Label} from "@/components/ui/label.tsx";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";

function AdminFilesPage() {
    const data = generateMockFiles(30);

    return (
        <BatchLoader states={[]}
                     loadingMessage={"Загрузка файлов"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Файлы</Label>
                             <AdminFilesTableView data={data}></AdminFilesTableView>
                         </div>
                     }
        />
    )
}

export default AdminFilesPage;