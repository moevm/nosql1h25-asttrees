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
import {Eye, SettingsIcon, Shield} from "lucide-react";
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
import {useEffect, useState} from "react";
import {$api, defaultOnErrorHandler} from "@/api";
import {toast} from "sonner";
import {useAtomValue} from "jotai/react";
import {$currentUser} from "@/store/store.ts";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";

const formSchema = z.object({
    oldPassword: z.string().min(3, "Минимум 3 символа"),
    newPassword: z.string().min(3, "Минимум 3 символа"),
});

export function userSettingsChangeQuery() {
    return $api.useMutation('patch', '/users/me', {
        onSuccess(data) {
            if (data) {
                toast.success('Настройки пользователя были успешно обновлены!')
            }
        },
        onError: defaultOnErrorHandler
    })
}


function UserSettingsDialog () {

    const user = useAtomValue($currentUser)!
    const [visibility, setVisibility] = useState<string>('public');
    const [showDialog, setShowDialog] = useState<boolean>(false);

    useEffect(() => {
        if (user.state === "hasData") {
            setVisibility(user.data.visibility.toLowerCase());
        }
    }, [user]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        },
    });

    const {
        mutate,
        isPending
    } = userSettingsChangeQuery()

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values, visibility)

        mutate({
            body: {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                visibility: visibility.toUpperCase()
            }
        });

        form.reset();
        setShowDialog(false);

    }

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
                <Button className="ml-auto flex justify-center gap-2">
                    <SettingsIcon /> Настройки
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Настройки</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Старый пароль</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите старый пароль" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Новый пароль</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите новый пароль" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-2 items-start">
                            <Label className="font-bold">Публичность</Label>
                            <Label className="text-primary/60">Кто может просматривать этот профиль</Label>

                            <Button
                                type={"button"}
                                variant={`${visibility === "public" ? "secondary" : "ghost"}`}
                                className={`flex gap-2 justify-start text-left p-6  w-full`}
                                onClick={() => {
                                    setVisibility("public");
                                    console.log(visibility)}}>

                                <div className={"flex justify-between items-center gap-2"}>
                                    <Eye className=""/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Публичный</Label>
                                        <Label className="text-primary/60">Любой человек</Label>
                                    </div>
                                </div>

                            </Button>

                            <Button
                                type={"button"}
                                variant={`${visibility === "private" ? "secondary" : "ghost"}`}
                                className={`flex gap-2 justify-start text-left p-6 w-full`}
                                onClick={() => {
                                    setVisibility("private");
                                    console.log(visibility)}}>

                                <div className={"flex justify-between items-center gap-2"}>
                                    <Shield className="mt-1"/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Защищенный</Label>
                                        <Label className="text-primary/60">Авторизованные пользователи</Label>
                                    </div>
                                </div>

                            </Button>
                        </div>

                        <DialogFooter className={"flex w-full justify-between"}>
                            <Button type="submit">Сохранить</Button>
                            <div className={"ml-auto"}>
                                <DialogClose asChild >
                                    <Button variant="outline" type={"button"}>Отмена</Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UserSettingsDialog;
