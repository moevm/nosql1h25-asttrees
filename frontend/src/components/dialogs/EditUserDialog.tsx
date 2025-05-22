import {useAtom} from "jotai";
import {$showEditUserDialog, type ApiEntityUserModel} from "@/store/store.ts";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon, Eye, EyeOff} from "lucide-react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useEffect} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {ru} from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";
import {getInitialDate, userSchema} from "@/lib/formSchemas.ts";

function EditUserContent(props: {
    data?: ApiEntityUserModel,
    onSave?: (data: z.infer<typeof userSchema>) => void
}) {
    const [open, setOpen] = useAtom($showEditUserDialog)
    const today = new Date();

    const initialFormValues = {
        username: props.data?.username || '',
        email: props.data?.email || '',
        visibility: props.data?.visibility || 'PUBLIC',
        isAdmin: props.data?.isAdmin ?? false,
        repositoryCount: props.data?.repositoryCount ?? 0,
        createdAt: getInitialDate(props.data?.createdAt),
    };

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: initialFormValues
    });

    useEffect(() => {
        if (open) {
            form.reset(initialFormValues);
        }
    }, [open]);

    const onSubmit = async (data: z.infer<typeof userSchema>) => {
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
                    <DialogTitle>{props.data ? "Изменить пользователя" : "Создать пользователя"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Никнейм</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Никнейм" {...field} />
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

                        <div className="flex flex-col gap-2 items-start">
                            <Label className="font-bold">Публичность</Label>
                            <Label className="text-primary/60">Кто может просматривать этот репозиторий</Label>

                            <Button
                                type={"button"}
                                variant={`${form.watch("visibility") === "PUBLIC" ? "default" : "ghost"}`}
                                className="flex gap-2 justify-start text-left p-6 w-full"
                                onClick={() => {
                                    form.setValue("visibility", "PUBLIC")
                                }}
                            >
                                <div className={"flex justify-between items-center gap-2"}>
                                    <Eye className=""/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Публичный</Label>
                                        <Label className="opacity-75">Любой человек</Label>
                                    </div>
                                </div>
                            </Button>

                            <Button
                                type={"button"}
                                variant={`${form.watch("visibility") === "PRIVATE" ? "default" : "ghost"}`}
                                className={`flex gap-2 justify-start text-left p-6 w-full`}
                                onClick={() => {
                                    form.setValue("visibility", "PRIVATE")
                                }}>

                                <div className={"flex justify-between items-center gap-2"}>
                                    <EyeOff className="mt-1"/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Приватный</Label>
                                        <Label className="opacity-75">Только я</Label>
                                    </div>
                                </div>
                            </Button>
                        </div>

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

                        <FormField
                            control={form.control}
                            name="isAdmin"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Администратор
                                        </label>
                                    </div>
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

function EditUserDialog(props: {
    data?: ApiEntityUserModel,
    onSave?: (data: z.infer<typeof userSchema>) => void
}) {
    return (
        <EditUserContent data={props.data} onSave={props.onSave}/>
    )
}

export default EditUserDialog