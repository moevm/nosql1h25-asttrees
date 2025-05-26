import {useAtom} from "jotai";
import {
    $showEditCommitDialog, type ApiEntityCommitModel
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
import {commitSchema, getInitialDate, userSchema} from "@/lib/formSchemas.ts";
import {DynamicForm} from "@/components/custom/DynamicForm.tsx";


function EditCommitContent(props: {
    data: ApiEntityCommitModel,
    onSave: (data: z.infer<typeof commitSchema>) => Promise<void>
}) {
    const [open, setOpen] = useAtom($showEditCommitDialog)
    const [loading, setLoading] = useState(false)
    
    const initialFormValues = {
        hash: props.data.hash,
        author: props.data.author ,
        email: props.data.email ,
        message: props.data.message,
        filesChanged: props.data.filesChanged ,
        linesAdded: props.data.linesAdded ,
        linesRemoved: props.data.linesRemoved ,
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

                <DynamicForm schema={commitSchema} onSubmit={onSubmit} defaultValues={initialFormValues} isLoading={loading} />
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
