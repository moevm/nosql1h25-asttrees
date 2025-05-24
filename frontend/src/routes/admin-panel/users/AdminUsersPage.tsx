import AdminUsersTableView from "@/routes/admin-panel/users/components/AdminUsersTableView.tsx";
import {Label} from "@/components/ui/label.tsx";
import EditUserDialog from "@/components/dialogs/EditUserDialog.tsx";
import type {userSchema} from "@/lib/formSchemas.ts";

function AdminUsersPage() {
    const onSave = (data: z.infer<typeof userSchema>) => {
        console.log("создание юзера", data)
    };
    return (
        <>
            {/*<EditUserDialog onSave={onSave}/>*/}
            <div className={"flex flex-col p-8"}>
                <Label className={"text-4xl"}>Пользователи</Label>
                <AdminUsersTableView/>
            </div>
        </>
    );
}

export default AdminUsersPage;
