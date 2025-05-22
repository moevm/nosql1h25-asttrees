import {Label} from "@/components/ui/label.tsx";
import AdminAstTreesTableView from "@/routes/admin-panel/ast-trees/components/AdminAstTreesTableView.tsx";
import EditAstTreeDialog from "@/components/dialogs/EditAstTreeDialog.tsx";
import {astTreeSchema} from "@/lib/formSchemas.ts";

function AdminAstTreesPage() {
    const onSave = (data: z.infer<typeof astTreeSchema>) => {
        console.log("создание дерева", data)
    };

    return (
        <>
            <EditAstTreeDialog onSave={onSave}/>
            <div className={"flex flex-col p-8"}>
                <Label className={"text-4xl"}>AST-деревья</Label>
                <AdminAstTreesTableView/>
            </div>
        </>
    );
}

export default AdminAstTreesPage;