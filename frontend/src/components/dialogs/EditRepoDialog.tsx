import {useAtom} from "jotai";
import {
    $showEditRepoDialog,
    type ApiEntityRepositoryModel
} from "@/store/store.ts";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon, Eye, EyeOff, Shield} from "lucide-react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {ru} from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";
import {getInitialDate, repoSchema, userSchema} from "@/lib/formSchemas.ts";
import {DynamicForm} from "@/components/custom/DynamicForm.tsx";


function EditRepoContent(props: {
    data: ApiEntityRepositoryModel,
    onSave: (data: z.infer<typeof repoSchema>) => Promise<void>
}) {
    const [open, setOpen] = useAtom($showEditRepoDialog)
    const [loading, setLoading] = useState(false)

    const initialFormValues = {
        name: props.data.name,
        ownerId: props.data.owner?.id,
        visibility: props.data.visibility,
        createdAt: getInitialDate(props.data.createdAt),
        originalLink: props.data.originalLink
    };

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
                    <DialogTitle>{"Изменить репозиторий"}</DialogTitle>
                </DialogHeader>

                <DynamicForm schema={repoSchema} onSubmit={onSubmit} defaultValues={initialFormValues} />
            </DialogContent>
        </Dialog>
    )
}

function EditRepoDialog(props: {
    data: ApiEntityRepositoryModel,
    onSave: (data: z.infer<typeof repoSchema>) => Promise<void>
}) {

    return (
        <EditRepoContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditRepoDialog
