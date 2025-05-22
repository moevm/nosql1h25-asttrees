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
import {useEffect} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {ru} from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";
import {commitSchema, getInitialDate} from "@/lib/formSchemas.ts";


function EditCommitContent(props: {
    data?: ApiEntityCommitModel,
    onSave?: (data: z.infer<typeof commitSchema>) => void
}) {
    const [open, setOpen] = useAtom($showEditCommitDialog)
    const today = new Date();

    const initialFormValues = {
        hash: props.data?.hash || '',
        author: props.data?.author || '',
        email: props.data?.email || '',
        message: props.data?.message || '',
        filesChanged: props.data?.filesChanged ?? 0,
        linesAdded: props.data?.linesAdded ?? 0,
        linesRemoved: props.data?.linesRemoved ?? 0,
        createdAt: getInitialDate(props.data?.createdAt),
    };

    const form = useForm<z.infer<typeof commitSchema>>({
        resolver: zodResolver(commitSchema),
        defaultValues: initialFormValues,
    });

    useEffect(() => {
        if (open) {
            form.reset(initialFormValues);
        }
    }, [open]);

    const onSubmit = async (data: z.infer<typeof commitSchema>) => {
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
                    <DialogTitle>{props.data ? "Изменить коммит" : "Создать коммит"}</DialogTitle>
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
                                                toDate={today}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
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

function EditCommitDialog(props: {
    data?: ApiEntityCommitModel,
    onSave?: (data: z.infer<typeof commitSchema>) => void
}) {
    return (
        <EditCommitContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditCommitDialog