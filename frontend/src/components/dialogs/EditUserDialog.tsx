import {useAtom} from "jotai";
import {$showEditUserDialog, type ApiEntityUserModel} from "@/store/store.ts";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import * as z from "zod";
import {getInitialDate, userSchema} from "@/lib/formSchemas.ts";
import {DynamicForm} from "@/components/custom/DynamicForm.tsx";
import dayjs from "dayjs";
import {useCallback, useState} from "react";

function EditUserContent(props: {
    data: ApiEntityUserModel,
    onSave: (data: z.infer<typeof userSchema>) => Promise<void>
}) {
    const [open, setOpen] = useAtom($showEditUserDialog)
    const [loading, setLoading] = useState(false)

    const initialFormValues = {
        username: props.data.username,
        email: props.data.email,
        visibility: props.data.visibility,
        isAdmin: props.data.isAdmin,
        createdAt: getInitialDate(props.data.createdAt)
    }
    
    const onSubmit = useCallback(async (data: z.infer<typeof userSchema>) => {
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
                    <DialogTitle>{"Изменить пользователя"}</DialogTitle>
                </DialogHeader>

                <DynamicForm schema={userSchema} onSubmit={onSubmit} defaultValues={initialFormValues} isLoading={loading}/>
            </DialogContent>
        </Dialog>
    )
}

function EditUserDialog(props: {
    data: ApiEntityUserModel,
    onSave: (data: z.infer<typeof userSchema>) => Promise<void>
}) {
    return (
        <EditUserContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditUserDialog
