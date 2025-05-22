import {useAtom} from "jotai";
import {
    $adminRepo,
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
    name: z.string().min(1, "Обязательное поле"),
    ownerId: z.string().min(1, "Обязательное поле"),
    visibility: z.enum(["PUBLIC", "PRIVATE", "PROTECTED"]),
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
    originalLink: z.string().url(),
});

function EditRepoContent(props: {
    data: ApiEntityRepositoryModel
}) {
    const [open, setOpen] = useAtom($showEditRepoDialog)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: props.data.name,
            ownerId: props.data.owner?.id,
            visibility: props.data.visibility,
            createdAt: props.data.createdAt,
            originalLink: props.data.originalLink,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: props.data.name,
                ownerId: props.data.owner?.id,
                visibility: props.data.visibility,
                createdAt: props.data.createdAt,
                originalLink: props.data.originalLink,
            });
        }
    }, [open, form, props.data.name, props.data.owner?.id, props.data.visibility, props.data.createdAt, props.data.originalLink]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        setOpen(false)
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Изменить репозиторий</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Название</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Название" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ownerId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Владелец</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Id владельца" {...field} />
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

                            <Button
                                type={"button"}
                                variant={`${form.watch("visibility") === "PROTECTED" ? "default" : "ghost"}`}
                                className={`flex gap-2 justify-start text-left p-6 w-full`}
                                onClick={() => {
                                    form.setValue("visibility", "PROTECTED")
                                }}>

                                <div className={"flex justify-between items-center gap-2"}>
                                    <Shield className="mt-1"/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Защищенный</Label>
                                        <Label className="opacity-75">Авторизованные пользователи</Label>
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
                            name="originalLink"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Источник</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Url репозитория" {...field} />
                                    </FormControl>
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

function EditRepoDialog() {
    const adminRepo = useAtomValue($adminRepo)

    return (
        <BatchLoader states={[adminRepo]}
                     loadingMessage={"Загрузка репозитория"}
                     display={() =>
                         <EditRepoContent data={loaded(adminRepo).data}/>
                     }
        />
    )
}

export default EditRepoDialog