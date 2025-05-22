import {useAtom} from "jotai";
import {
    $adminCommit,
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
import {useAtomValue} from "jotai/react";
import {loaded} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {useEffect} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {ru} from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";

const formSchema = z.object({
    hash: z.string().min(1, "Обязательное поле"),
    author: z.string().min(1, "Обязательное поле"),
    email: z.string().email("Некорректный email"),
    message: z.string().min(1, "Обязательное поле"),
    filesChanged: z.preprocess(
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
    linesAdded: z.preprocess(
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
    linesRemoved: z.preprocess(
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

function EditCommitContent(props: {
    data: ApiEntityCommitModel
}) {
    const [open, setOpen] = useAtom($showEditCommitDialog)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hash: props.data.hash,
            author: props.data.author,
            email: props.data.email,
            message: props.data.message,
            filesChanged: props.data.filesChanged,
            linesAdded: props.data.linesAdded,
            linesRemoved: props.data.linesRemoved,
            createdAt: props.data.createdAt,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                hash: props.data.hash,
                author: props.data.author,
                email: props.data.email,
                message: props.data.message,
                filesChanged: props.data.filesChanged,
                linesAdded: props.data.linesAdded,
                linesRemoved: props.data.linesRemoved,
                createdAt: props.data.createdAt,
            });
        }
    }, [open, form, props.data.hash, props.data.author, props.data.email, props.data.message, props.data.filesChanged, props.data.linesAdded, props.data.linesRemoved, props.data.createdAt]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        setOpen(false)
    };


    return (
        // TODO слишком большой диалог, вылазит за границы экрана
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Изменить коммит</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="hash"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Hash</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Hash" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="author"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Автор</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Автор" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Сообщение</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Сообщение" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="filesChanged"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Файлов изменено</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Файлов изменено" {...field} min={0}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="linesAdded"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Строк добавлено</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Строк добавлено" {...field} min={0}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="linesRemoved"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Строк удалено</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Строк удалено" {...field} min={0}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="createdAt"
                            render={({field}) => (
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
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {field.value ? (
                                                        format(field.value, "PPP", {locale: ru})
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
                                    <FormMessage/>
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

function EditCommitDialog() {
    const adminCommit = useAtomValue($adminCommit)

    return (
        <BatchLoader states={[adminCommit]}
                     loadingMessage={"Загрузка коммита"}
                     display={() =>
                         <EditCommitContent data={loaded(adminCommit).data}/>
                     }
        />
    )
}

export default EditCommitDialog