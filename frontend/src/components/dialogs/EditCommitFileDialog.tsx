import {useAtom} from "jotai";
import {
    $showEditCommitDialog, $showEditFileDialog, type ApiEntityCommitFileModel, type ApiEntityCommitModel
} from "@/store/store.ts";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon} from "lucide-react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {ru} from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";
import {commitFileSchema, commitSchema, getInitialDate, userSchema} from "@/lib/formSchemas.ts";
import {DynamicForm} from "@/components/custom/DynamicForm.tsx";


function EditCommitFileContent(props: {
    data: ApiEntityCommitFileModel,
    onSave: (data: z.infer<typeof commitSchema>) => Promise<void>
}) {
    const [open, setOpen] = useAtom($showEditFileDialog)
    const [loading, setLoading] = useState(false)

    const initialFormValues = {
        name: props.data.name,
        fullPath: props.data.fullPath,
        type: props.data.type,
        hash: props.data.hash ?? '',
        parent: props.data.parent ?? '',
        commit: props.data.commit?.id,
        originalAuthor: props.data.originalAuthor,
        lastChangedBy: props.data.lastChangedBy,
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

                <DynamicForm schema={commitFileSchema} onSubmit={onSubmit} defaultValues={initialFormValues} isLoading={loading} />
            </DialogContent>
        </Dialog>
    )
}

function EditCommitFileDialog(props: {
    data: ApiEntityCommitFileModel,
    onSave: (data: z.infer<typeof commitFileSchema>) => Promise<void>
}) {
    return (
        <EditCommitFileContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditCommitFileDialog
