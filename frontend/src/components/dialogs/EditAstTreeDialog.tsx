import {useAtom} from "jotai";
import {
    $adminAstTree,
    $showEditAstTreeDialog,
    type ApiEntityAstTreeModel, type ApiEntityBranchModel
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
import {useEffect} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import { ru } from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";
import {astTreeSchema, branchSchema, getInitialDate} from "@/lib/formSchemas.ts";

function EditAstTreeContent(props: {
    data?: ApiEntityAstTreeModel,
    onSave?: (data: z.infer<typeof astTreeSchema>) => void
}) {
    const [open, setOpen] = useAtom($showEditAstTreeDialog)
    const today = new Date();

    const initialFormValues = {
        depth: props.data?.depth ?? 0,
        size: props.data?.size ?? 0,
        commitFileId: props.data?.commitFile?.id || '',
        createdAt: getInitialDate(props.data?.createdAt),
    };

    const form = useForm<z.infer<typeof astTreeSchema>>({
        resolver: zodResolver(astTreeSchema),
        defaultValues: initialFormValues,
    });

    useEffect(() => {
        if (open) {
            form.reset(initialFormValues);
        }
    }, [open]);

    const onSubmit = async (data: z.infer<typeof astTreeSchema>) => {
        console.log(data)
        if (props.onSave) {
            props.onSave(data)
        }
        setOpen(false)
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{props.data ? "Изменить AST-дерево" : "Создать AST-дерево"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="depth"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Глубина</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Глубина" {...field} min={0}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="size"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Размер</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Размер" {...field} min={0}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="commitFileId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Файл</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Id файла" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="createdAt"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    {/*TODO: выделение при наведении на лейбл Дата создания*/}
                                    <FormLabel>Дата создания</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: ru })
                                                    ) : (
                                                        <span>Выберите дату</span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                                locale={ru}
                                                toDate={today}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className={"flex w-full justify-between"}>
                            <Button type="submit">{props.data ? "Изменить" : "Создать"}</Button>
                            <div className={"ml-auto"}>
                                <DialogClose asChild>
                                    <Button variant="outline">Отмена</Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function EditAstTreeDialog(props: {
    data?: ApiEntityAstTreeModel,
    onSave?: (data: z.infer<typeof astTreeSchema>) => void
}) {
    return (
        <EditAstTreeContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditAstTreeDialog