import {useAtom} from "jotai";
import {
    $adminAstNode,
    $showEditAstNodeDialog,
    type ApiEntityAstNodeModel, type ApiEntityBranchModel
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
import {useCallback, useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import { ru } from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";
import {astNodeSchema, branchSchema, getInitialDate, userSchema} from "@/lib/formSchemas.ts";
import {DynamicForm} from "@/components/custom/DynamicForm.tsx";

function EditAstNodeContent(props: {
    data: ApiEntityAstNodeModel,
    onSave: (data: z.infer<typeof astNodeSchema>) => Promise<void>
}) {
    const [open, setOpen] = useAtom($showEditAstNodeDialog)
    const [loading, setLoading] = useState(false)

    const initialFormValues = {
        type: props.data.type,
        label: props.data.label,
        tree: props.data.tree ?? '',
    }

    const onSubmit = useCallback(async (data: z.infer<typeof astNodeSchema>) => {
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
                    <DialogTitle>{props.data ? "Изменить AST-узел" : "Создать AST-узел"}</DialogTitle>
                </DialogHeader>

               <DynamicForm schema={astNodeSchema} onSubmit={onSubmit} defaultValues={initialFormValues} isLoading={loading} />
            </DialogContent>
        </Dialog>
    )
}

function EditAstNodeDialog(props: {
    data: ApiEntityAstNodeModel,
    onSave: (data: z.infer<typeof astNodeSchema>) => Promise<void>
}) {
    return (
        <EditAstNodeContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditAstNodeDialog
