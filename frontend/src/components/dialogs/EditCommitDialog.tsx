import {useAtom} from "jotai";
import {
    $showEditCommitDialog, type ApiEntityCommitModel
} from "@/store/store.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import * as z from "zod";
import {useCallback, useState} from "react";
import {commitSchema, getInitialDate} from "@/lib/formSchemas.ts";
import {DynamicForm} from "@/components/custom/DynamicForm.tsx";


function EditCommitContent(props: {
    data: ApiEntityCommitModel,
    onSave: (data: z.infer<typeof commitSchema>) => Promise<void>
}) {
    const [open, setOpen] = useAtom($showEditCommitDialog)
    const [loading, setLoading] = useState(false)

    const initialFormValues = {
        hash: props.data.hash,
        author: props.data.author,
        email: props.data.email,
        message: props.data.message,
        filesChanged: props.data.filesChanged,
        linesAdded: props.data.linesAdded,
        linesRemoved: props.data.linesRemoved,
        createdAt: getInitialDate(props.data.createdAt),
    };


    const onSubmit = useCallback(async (data: z.infer<typeof commitSchema>) => {
        setLoading(true)
        try {
            await props.onSave(data)
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{props.data ? "Изменить коммит" : "Создать коммит"}</DialogTitle>
                </DialogHeader>

                <DynamicForm schema={commitSchema} onSubmit={onSubmit} defaultValues={initialFormValues}
                             isLoading={loading}/>
            </DialogContent>
        </Dialog>
    )
}

function EditCommitDialog(props: {
    data: ApiEntityCommitModel,
    onSave: (data: z.infer<typeof commitSchema>) => Promise<void>
}) {
    return (
        <EditCommitContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditCommitDialog
