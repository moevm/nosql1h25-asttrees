import {Dialog} from "@radix-ui/react-dialog";
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Eye, EyeOff, Package, Shield} from "lucide-react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Input} from "@/components/ui/input.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState} from "react";
import {useRegisterMutation} from "@/api/auth.ts";
import {useAddRepoMutation} from "@/components/dialogs/reposQueries.ts";

const formSchema = z.object({
    url: z.string().min(3, "Минимум 3 символа"),
    name: z.string().min(3, "Минимум 3 символа"),
});

function UserAddRepoDialog() {

    const {
        mutate,
        isPending
    } = useAddRepoMutation()

    const [visibility, setVisibility] = useState<string>("public");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
            name: ""
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values, visibility)
        mutate({
            body: {
                originalLink: values.url,
                name: values.name,
                visibility: visibility.toUpperCase()
            }
        });

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="ml-auto flex justify-center gap-2">
                    <Package/> Добавить в репозиторий
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>Добавить репозиторий</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите URL репозитория" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Название</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите название" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-2 items-start">
                            <Label className="font-bold">Публичность</Label>
                            <Label className="text-gray-400">Кто может просматривать этот репозиторий</Label>

                            <Button
                                type={"button"}
                                variant={`${visibility === "public" ? "" : "ghost"}`}
                                className="flex gap-2 justify-start text-left p-6 w-full"
                                onClick={() => {
                                    setVisibility("public");
                                    console.log(visibility)
                                }}
                            >
                                <div className={"flex justify-between items-center gap-2"}>
                                    <Eye className=""/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Публичный</Label>
                                        <Label className="text-gray-400">Любой человек может просматревать ваши
                                            репозитории</Label>
                                    </div>
                                </div>

                            </Button>

                            <Button
                                type={"button"}
                                variant={`${visibility === "protected" ? "" : "ghost"}`}
                                className={`flex gap-2 justify-start text-left p-6 w-full`}
                                onClick={() => {
                                    setVisibility("protected");
                                    console.log(visibility)
                                }}>

                                <div className={"flex justify-between items-center gap-2"}>
                                    <Shield className="mt-1"/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Защищенный</Label>
                                        <Label className="text-gray-400">Авторизованные пользователи</Label>
                                    </div>
                                </div>

                            </Button>

                            <Button
                                type={"button"}
                                variant={`${visibility === "private" ? "" : "ghost"}`}
                                className={`flex gap-2 justify-start text-left p-6 w-full`}
                                onClick={() => {
                                    setVisibility("private");
                                    console.log(visibility)
                                }}>

                                <div className={"flex justify-between items-center gap-2"}>
                                    <EyeOff className="mt-1"/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Приватный</Label>
                                        <Label className="text-gray-400">Только я</Label>
                                    </div>
                                </div>

                            </Button>
                        </div>

                        <DialogFooter className={"flex w-full justify-between"}>
                            <Button type="submit" className="hover:cursor-pointer">Импортировать</Button>
                            <div className={"ml-auto"}>
                                <DialogClose asChild>
                                    <Button variant="outline" className="hover:cursor-pointer">Отмена</Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UserAddRepoDialog;