import {Label} from "@/components/ui/label.tsx";
import AdminAstTreesTableView from "@/routes/admin-panel/ast-trees/components/AdminAstTreesTableView.tsx";

function AdminAstTreesPage() {
    return (
        <div className={"flex flex-col p-8"}>
            <Label className={"text-4xl"}>AST-деревья</Label>
            <AdminAstTreesTableView/>
        </div>
    );
}

export default AdminAstTreesPage;