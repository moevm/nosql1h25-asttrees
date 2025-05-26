import {Label} from "@/components/ui/label.tsx";
import AdminAstNodesTableView from "@/routes/admin-panel/ast-nodes/components/AdminAstNodesTableView.tsx";

function AdminAstNodesPage() {
    return (
        <>
            <div className={"flex flex-col p-8"}>
                <Label className={"text-4xl"}>AST-узлы</Label>
                <AdminAstNodesTableView/>
            </div>
        </>
    );
}

export default AdminAstNodesPage;
