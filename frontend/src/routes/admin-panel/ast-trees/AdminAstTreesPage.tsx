import {Label} from "@/components/ui/label.tsx";
import AdminAstTreesTableView from "@/routes/admin-panel/ast-trees/components/AdminAstTreesTableView.tsx";

function AdminAstTreesPage() {
    const astTrees = [
        {
            id: "id",
            hash: "hash",
            depth: 35,
            size: 10
        }
    ]

    return (
        <div className={"flex flex-col p-8"}>
            <Label className={"text-4xl"}>AST-деревья</Label>
            <AdminAstTreesTableView data={astTrees}></AdminAstTreesTableView>
        </div>
    );
}

export default AdminAstTreesPage;