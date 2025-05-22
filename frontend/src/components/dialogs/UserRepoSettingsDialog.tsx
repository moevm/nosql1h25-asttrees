import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader2} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import * as z from "zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import type {ApiRepositoryModel} from "@/store/store.ts";
import {useChangeRepoMutation} from "@/components/dialogs/reposQueries.ts";
import {visibilityOptions} from "@/lib/types.ts";

const formSchema = z.object({
    url: z.string().min(3, "Минимум 3 символа"),
    name: z.string().min(3, "Минимум 3 символа"),
});

function UserRepoSettingsDialog({repo}: { repo: ApiRepositoryModel }) {
    const [visibility, setVisibility] = useState<string>(repo.visibility.toUpperCase());

    const {
        mutate,
        isPending
    } = useChangeRepoMutation(repo.id);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: repo.originalLink,
            name: repo.name
        },
    });

    useEffect(() => {
        form.reset({
            url: repo.originalLink,
            name: repo.name
        });
        setVisibility(repo.visibility.toUpperCase());
    }, [repo, form.reset]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            body: {
                name: values.name,
                visibility: visibility.toUpperCase()
            }
        }, {
            onSuccess: () => {
                form.reset({
                    url: repo.originalLink,
                    name: values.name,
                });
            }
        });
    }

    const hasChanges = form.formState.isDirty || visibility.toUpperCase() !== repo.visibility.toUpperCase();

    return (
        <DialogContent className="w-full max-w-md">
            <DialogHeader>
                <DialogTitle>Настройки репозитория</DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form disabled={isPending} className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="url"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                    <Input disabled={true} className={"bg-muted"}
                                           placeholder="Введите URL репозитория" {...field} />
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
                        <Label className="text-primary/60">Кто может просматривать этот репозиторий</Label>

                        {visibilityOptions.map((option: VisibilityOption) => {
                            const IconComponent = option.icon;
                            const isActive = visibility === option.value;
                            return (
                                <Button
                                    key={option.value}
                                    type="button"
                                    variant={isActive ? "default" : "ghost"}
                                    className="flex gap-2 justify-start text-left p-6 w-full"
                                    onClick={() => setVisibility(option.value)}
                                >
                                    <div className="flex justify-between items-center gap-2">
                                        <IconComponent className={option.value !== "PUBLIC" ? "mt-1" : ""}/>
                                        <div className="flex flex-col gap-1">
                                            <Label className="font-bold">{option.label}</Label>
                                            <Label className="opacity-75">{option.description}</Label>
                                        </div>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>

                    <DialogFooter className={"flex w-full justify-between"}>
                        <Button type="submit" disabled={isPending || !hasChanges}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Изменение...
                                </>
                            ) : (
                                "Изменить"
                            )}
                        </Button>
                        <div className={"ml-auto"}>
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        if (form.formState.isDirty) {
                                            form.reset({
                                                url: repo.originalLink,
                                                name: repo.name,
                                            });
                                        }
                                        if (visibility.toUpperCase() !== repo.visibility.toUpperCase()) {
                                            setVisibility(repo.visibility.toUpperCase());
                                        }
                                    }}
                                >
                                    Отмена
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}

export default UserRepoSettingsDialog;