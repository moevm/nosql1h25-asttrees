import FilesAdminTableView, {generateMockFiles} from "@/routes/admin-panel/files/components/FilesAdminTableView.tsx";
import {Label} from "@/components/ui/label.tsx";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";

function FilesPage() {
    const data = generateMockFiles(30);

    return (
        <BatchLoader states={[]}
                     loadingMessage={"Загрузка файлов"}
                     display={() =>
                         <div className={"flex flex-col p-8"}>
                             <Label className={"text-4xl"}>Файлы</Label>
                             <FilesAdminTableView data={data}></FilesAdminTableView>
                         </div>
                     }
        />
    )
}

export default FilesPage;