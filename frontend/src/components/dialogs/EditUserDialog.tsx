import {useAtom} from "jotai";
import {$adminUser, $showEditUserDialog, type ApiEntityUserModel} from "@/store/store.ts";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon, Eye, EyeOff} from "lucide-react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAtomValue} from "jotai/react";
import {loaded} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useEffect} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import { ru } from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";

const formSchema = z.object({
    username: z.string().min(1, "Обязательное поле"),
    email: z.string().email("Некорректный email"),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
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
    isAdmin: z.boolean(),
});

function EditUserContent(props: {
    data: ApiEntityUserModel
}) {
    const [open, setOpen] = useAtom($showEditUserDialog)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: props.data.username,
            email: props.data.email,
            visibility: props.data.visibility,
            createdAt: props.data.createdAt,
            isAdmin: props.data.isAdmin,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                username: props.data.username,
                email: props.data.email,
                visibility: props.data.visibility,
                createdAt: props.data.createdAt,
                isAdmin: props.data.isAdmin,
            });
        }
    }, [open, form, props.data.username, props.data.email, props.data.visibility, props.data.createdAt, props.data.isAdmin]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        setOpen(false)
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Изменить пользователя</DialogTitle>
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

function EditUserDialog() {
    const adminUser = useAtomValue($adminUser)

    return (
        <BatchLoader states={[adminUser]}
                     loadingMessage={"Загрузка пользователя"}
                     display={() =>
                         <EditUserContent data={loaded(adminUser).data}/>
                     }
        />
    )
}

export default EditUserDialog