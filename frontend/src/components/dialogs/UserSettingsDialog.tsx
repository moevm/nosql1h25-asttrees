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

const formSchema = z.object({
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
}).superRefine((data, ctx) => {
    const {oldPassword, newPassword} = data;
    const oldPasswordEntered = oldPassword && oldPassword.length > 0;
    const newPasswordEntered = newPassword && newPassword.length > 0;

    // Валидация длины, если пароль введен
    if (oldPasswordEntered && oldPassword?.length < 3) {
        ctx.addIssue({
            path: ['oldPassword'],
            message: 'Минимум 3 символа',
            code: z.ZodIssueCode.too_small,
            minimum: 3,
            type: "string",
            inclusive: true,
        });
    }
    if (newPasswordEntered && newPassword?.length < 3) {
        ctx.addIssue({
            path: ['newPassword'],
            message: 'Минимум 3 символа',
            code: z.ZodIssueCode.too_small,
            minimum: 3,
            type: "string",
            inclusive: true,
        });
    }

    if (oldPasswordEntered && !newPasswordEntered && oldPassword?.length >= 3) {
        ctx.addIssue({
            path: ['newPassword'],
            message: 'Новый пароль обязателен, если введен старый.',
            code: z.ZodIssueCode.custom,
        });
    }
    if (!oldPasswordEntered && newPasswordEntered && newPassword?.length >= 3) {
        ctx.addIssue({
            path: ['oldPassword'],
            message: 'Старый пароль обязателен, если введен новый.',
            code: z.ZodIssueCode.custom,
        });
    }
});

export function userSettingsChangeQuery() {
    return $api.useMutation('patch', '/users/me', {
        onSuccess(data, variables, context) {
            if (data) {
                toast.success('Настройки пользователя были успешно обновлены!')
            }
            window.location.reload();
        },
        onError: defaultOnErrorHandler
    })
}


function UserSettingsDialog() {
    const user = useAtomValue($currentUser)!
    const [visibility, setVisibility] = useState<string>('public');
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        },
    });

    useEffect(() => {
        if (user.state === "hasData") {
            setVisibility(user.data.visibility.toLowerCase());
        }
    }, [user, showDialog]);

    const {
        mutate,
        isPending
    } = userSettingsChangeQuery()

    function onSubmit(values: z.infer<typeof formSchema>) {
        const payload: {
            visibility: string;
            oldPassword?: string;
            newPassword?: string;
        } = {
            visibility: visibility.toUpperCase(),
        };

        if (values.oldPassword && values.oldPassword.length >= 3 &&
            values.newPassword && values.newPassword.length >= 3) {
            payload.oldPassword = values.oldPassword;
            payload.newPassword = values.newPassword;
        } else if ((values.oldPassword && values.oldPassword.length > 0) || (values.newPassword && values.newPassword.length > 0)) {

        }


        mutate({body: payload}, {
            onSuccess: () => {
                form.reset({oldPassword: "", newPassword: ""});
                setShowDialog(false);
                if (user.state === "hasData") {
                    setVisibility(payload.visibility.toLowerCase());
                }
            }
        });
    }

    const handleOpenChange = (isOpen: boolean) => {
        setShowDialog(isOpen);
        if (!isOpen) {
            form.reset({oldPassword: "", newPassword: ""});
            if (user.state === "hasData" && visibility.toUpperCase() !== user.data.visibility) {
                setVisibility(user.data.visibility.toLowerCase());
            }
        }
    }

    return (
        <Dialog open={showDialog} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="ml-auto flex justify-center gap-2">
                    <SettingsIcon/> Настройки
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
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Старый пароль</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Введите старый пароль" {...field}
                                               autoComplete="new-password"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Новый пароль</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Введите новый пароль" {...field}
                                               autoComplete="new-password"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-2 items-start">
                            <Label className="font-bold">Публичность</Label>
                            <Label className="text-primary/60">Кто может просматривать этот профиль</Label>

                            <Button
                                type={"button"}
                                variant={`${visibility === "public" ? "default" : "ghost"}`}
                                className={`flex gap-2 justify-start text-left p-6  w-full`}
                                onClick={() => setVisibility("public")}>
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
                                variant={`${visibility === "private" ? "default" : "ghost"}`}
                                className={`flex gap-2 justify-start text-left p-6 w-full`}
                                onClick={() => setVisibility("private")}>
                                <div className={"flex justify-between items-center gap-2"}>
                                    <Shield className="mt-1"/>
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Защищенный</Label>
                                        <Label className="opacity-75">Авторизованные пользователи</Label>
                                    </div>
                                </div>
                            </Button>
                        </div>

                        <DialogFooter className={"flex w-full justify-between"}>
                            <Button type="submit"
                                    disabled={isPending || !form.formState.isDirty && visibility.toUpperCase() === user.data?.visibility}>
                                {isPending ? "Сохранение..." : "Сохранить"}
                            </Button>
                            <div className={"ml-auto"}>
                                <DialogClose asChild>
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
