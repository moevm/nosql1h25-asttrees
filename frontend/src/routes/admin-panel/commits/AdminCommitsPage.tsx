import CommitsTableView from "@/routes/admin-panel/commits/components/AdminCommitsTableView.tsx";
import {Label} from "@/components/ui/label.tsx";
import React from "react";
import {commitSchema} from "@/lib/formSchemas.ts";
import EditCommitDialog from "@/components/dialogs/EditCommitDialog.tsx";

function AdminCommitsPage() {
    const onSave = (data: z.infer<typeof commitSchema>) => {
        console.log("создание коммита", data)
    };

    return (
        <>
            {/*<EditCommitDialog onSave={onSave}/>*/}
            <div className={"flex flex-col p-8"}>
                <Label className={"text-4xl"}>Коммиты</Label>
                <CommitsTableView/>
            </div>
        </>
    );
}

export default AdminCommitsPage;
