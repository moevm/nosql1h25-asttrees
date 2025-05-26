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
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import * as z from "zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {$userId, type ApiRepositoryModel, type ApiRepositoryViewModel} from "@/store/store.ts";
import {useChangeRepoMutation} from "@/components/dialogs/reposQueries.ts";
import {useAtomValue} from "jotai/react";


const formSchema = z.object({
    url: z.string().min(3, "Минимум 3 символа"),
    name: z.string().min(3, "Минимум 3 символа"),
});

function UserRepoSettingsDialog ({repo} : {repo: ApiRepositoryModel}) {
    const [visibility, setVisibility] = useState<string>("public")

    useEffect(() => {
        setVisibility(repo.visibility);
    }, [repo]);
    const userId = useAtomValue($userId)

    const {
        mutate,
        isPending
    } = useChangeRepoMutation(userId, repo.id);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: repo.originalLink,
            name: repo.name
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            body: {
                name: values.name,
                visibility: visibility.toUpperCase()
            }
        });

        form.reset();
    }

    return (
        <DialogContent className="w-full max-w-md">
            <DialogHeader>
                <DialogTitle>Настройки репозитория</DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                    <Input disabled={true} className={"bg-muted"} placeholder="Введите URL репозитория" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Название</FormLabel>
                                <FormControl>
                                    <Input placeholder="Введите название" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="font-bold">Публичность</Label>
                        <Label className="text-primary/60">Кто может просматривать этот репозиторий</Label>

                        <Button
                            type={"button"}
                            variant={`${visibility === "PUBLIC" ? "default" : "ghost"}`}
                            className={`flex gap-2 justify-start text-left p-6  w-full`}
                            onClick={() => {
                                setVisibility("PUBLIC");
                            }}>

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
                            variant={`${visibility === "PROTECTED" ? "default" : "ghost"}`}
                            className={`flex gap-2 justify-start text-left p-6 w-full`}
                            onClick={() => {
                                setVisibility("PROTECTED");
                            }}>

                            <div className={"flex justify-between items-center gap-2"}>
                                <Shield className="mt-1"/>
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Защищенный</Label>
                                    <Label className="opacity-75">Авторизованные пользователи</Label>
                                </div>
                            </div>

                        </Button>

                        <Button
                            type={"button"}
                            variant={`${visibility === "PRIVATE" ? "default" : "ghost"}`}
                            className={`flex gap-2 justify-start text-left p-6 w-full`}
                            onClick={() => {
                                setVisibility("PRIVATE");
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

                    <DialogFooter className={"flex w-full justify-between"}>
                        <Button type="submit">Изменить</Button>
                        <div className={"ml-auto"}>
                            <DialogClose asChild >
                                <Button variant="outline" type={"button"}>Отмена</Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}

export default UserRepoSettingsDialog;
