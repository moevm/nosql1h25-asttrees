import {useAtom} from "jotai";
import {
    $adminBranch,
    $showEditBranchDialog, type ApiEntityBranchModel
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
import {useEffect} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import { ru } from 'date-fns/locale';
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";

const formSchema = z.object({
    name: z.string().min(1, "Обязательное поле"),
    repoId: z.string().min(1, "Обязательное поле"),
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
    isDefault: z.boolean()
});

function EditBranchContent(props: {
    data: ApiEntityBranchModel
}) {
    const [open, setOpen] = useAtom($showEditBranchDialog)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: props.data.name,
            repoId: props.data.repository?.id,
            createdAt: props.data.createdAt,
            isDefault: props.data.isDefault,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: props.data.name,
                repoId: props.data.repository?.id,
                createdAt: props.data.createdAt,
                isDefault: props.data.isDefault,
            });
        }
    }, [open, form, props.data.name, props.data.repository?.id, props.data.createdAt, props.data.isDefault]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        setOpen(false)
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Изменить ветку</DialogTitle>
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
                            name="repoId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Репозиторий</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Id репозитория" {...field} />
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

                        <FormField
                            control={form.control}
                            name="isDefault"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Основная ветка
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

function EditBranchDialog() {
    const adminBranch = useAtomValue($adminBranch)

    return (
        <BatchLoader states={[adminBranch]}
                     loadingMessage={"Загрузка ветки"}
                     display={() =>
                         <EditBranchContent data={loaded(adminBranch).data}/>
                     }
        />
    )
}

export default EditBranchDialog