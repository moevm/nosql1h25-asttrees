import AdminReposTableView from "@/routes/admin-panel/repos/components/AdminReposTableView.tsx";
import {Label} from "@/components/ui/label.tsx";
import {repoSchema} from "@/lib/formSchemas.ts";
import EditRepoDialog from "@/components/dialogs/EditRepoDialog.tsx";

function AdminReposPage() {
    const onSave = (data: z.infer<typeof repoSchema>) => {
        console.log("создание репо", data)
    };

    return (
        <>
            {/*<EditRepoDialog onSave={onSave}/>*/}
            <div className={"flex flex-col p-8"}>
                <Label className={"text-4xl"}>Репозитории</Label>
                <AdminReposTableView/>
            </div>
        </>
    );
}

export default AdminReposPage;
