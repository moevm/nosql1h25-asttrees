import {useAtom} from "jotai";
import {
    $adminBranch,
    $showEditBranchDialog, type ApiEntityBranchModel, type ApiEntityUserModel
} from "@/store/store.ts";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon} from "lucide-react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAtomValue} from "jotai/react";
import {loaded} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useCallback, useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {ru} from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";
import {branchSchema, getInitialDate, repoSchema, userSchema} from "@/lib/formSchemas.ts";
import {DynamicForm} from "@/components/custom/DynamicForm.tsx";

function EditBranchContent(props: {
    data: ApiEntityBranchModel,
    onSave?: (data: z.infer<typeof branchSchema>) => Promise<void>
}) {
    const [open, setOpen] = useAtom($showEditBranchDialog)
    const [loading, setLoading] = useState(false)
    
    const initialFormValues = {
        name: props.data.name,
        repoId: props.data.repository?.id,
        createdAt: getInitialDate(props.data.createdAt),
        isDefault: props.data.isDefault,
    };
    const onSubmit = useCallback(async (data: z.infer<typeof branchSchema>) => {
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
                    <DialogTitle>{"Изменить ветку"}</DialogTitle>
                </DialogHeader>

                <DynamicForm schema={branchSchema} onSubmit={onSubmit} defaultValues={initialFormValues} isLoading={loading} />
            </DialogContent>
        </Dialog>
    )
}

function EditBranchDialog(props: {
    data: ApiEntityBranchModel,
    onSave: (data: z.infer<typeof branchSchema>) => Promise<void>
}) {
    return (
        <EditBranchContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditBranchDialog
