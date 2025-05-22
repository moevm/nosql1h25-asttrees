import {useAtom} from "jotai";
import {
    $adminAstTree,
    $showEditAstTreeDialog,
    type ApiEntityAstTreeModel
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

const formSchema = z.object({
    depth: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' && arg.trim() === '') {
                return undefined;
            }
            return arg;
        },
        z.coerce.number({
            required_error: "Обязательное поле",
            invalid_type_error: "Обязательное поле",
        })
            .int("Ожидается целое число")
            .nonnegative("Ожидается положительное число")
    ),
    size: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' && arg.trim() === '') {
                return undefined;
            }
            return arg;
        },
        z.coerce.number({
            required_error: "Обязательное поле",
            invalid_type_error: "Обязательное поле",
        })
            .int("Ожидается целое число")
            .nonnegative("Ожидается положительное число")
    ),
    commitFileId: z.string().min(1, "Обязательное поле"),
    createdAt: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) {
                const date = new Date(arg);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        },
        z.date({
            required_error: "Дата создания обязательна",
            invalid_type_error: "Некорректный формат даты",
        })
    ),
});

function EditAstTreeContent(props: {
    data: ApiEntityAstTreeModel
}) {
    const [open, setOpen] = useAtom($showEditAstTreeDialog)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            depth: props.data.depth,
            size: props.data.size,
            commitFileId: props.data.commitFile?.id,
            createdAt: props.data.createdAt,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                depth: props.data.depth,
                size: props.data.size,
                commitFileId: props.data.commitFile?.id,
                createdAt: props.data.createdAt,
            });
        }
    }, [open, form, props.data.depth, props.data.size, props.data.commitFile?.id, props.data.createdAt]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        setOpen(false)
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Изменить AST-дерево</DialogTitle>
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
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className={"flex w-full justify-between"}>
                            <Button type="submit">Изменить</Button>
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

function EditAstTreeDialog() {
    const adminAstTree = useAtomValue($adminAstTree)

    return (
        <BatchLoader states={[adminAstTree]}
                     loadingMessage={"Загрузка AST-дерева"}
                     display={() =>
                         <EditAstTreeContent data={loaded(adminAstTree).data}/>
                     }
        />
    )
}

export default EditAstTreeDialog