import {Dialog} from "@radix-ui/react-dialog";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Eye, EyeOff, Package, Shield, Loader2} from "lucide-react";
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
import {useCallback, useEffect, useState} from "react";
import {useAddRepoMutation} from "@/components/dialogs/reposQueries.ts";
import {visibilityOptions} from "@/lib/types.ts";
import {useAtomValue} from "jotai/react";
import {$userId} from "@/store/store.ts";

const formSchema = z.object({
    url: z.string().min(3, "Минимум 3 символа").url("Введите корректный url"),
    name: z.string().min(3, "Минимум 3 символа"),
});

function UserAddRepoDialog() {
    const [open, setOpen] = useState(false);
    const [visibility, setVisibility] = useState<string>("public");
    const userId = useAtomValue($userId)
    const {
        mutate,
        isPending
    } = useAddRepoMutation(userId!)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
            name: ""
        },
        mode: "onChange"
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            body: {
                originalLink: values.url,
                name: values.name,
                visibility: visibility.toUpperCase()
            },
        }, {
            onSuccess() {
                form.reset()
                setVisibility("public")
                setOpen(false)
            }
        });
    }

    const handleOpenChange = useCallback((newOpenState: boolean) => {
        console.info({
            newOpenState
        })
        if (isPending && !newOpenState) {
            return;
        }
        setOpen(newOpenState);
        if (!newOpenState) {
            form.reset();
            setVisibility("public");
        }
    }, []);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="ml-auto flex justify-center gap-2">
                    <Package/> Импортировать репозиторий
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-full max-w-md"
                onInteractOutside={(e) => {
                    if (isPending) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (isPending) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Импортировать репозиторий</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-4" disabled={isPending} onSubmit={form.handleSubmit(onSubmit)}>
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
                            <Label className="text-primary/60">Кто может просматривать этот репозиторий</Label>
                            {visibilityOptions.map(option => {
                                const IconComponent = option.icon;
                                return (
                                    <Button
                                        key={option.value}
                                        type="button"
                                        variant={visibility === option.value ? "secondary" : "ghost"}
                                        className="flex gap-2 justify-start text-left p-6 w-full"
                                        onClick={() => setVisibility(option.value)}
                                    >
                                        <div className="flex justify-between items-center gap-2">
                                            <IconComponent/>
                                            <div className="flex flex-col gap-1">
                                                <Label className="font-bold">{option.label}</Label>
                                                <Label className="text-primary/60">{option.description}</Label>
                                            </div>
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>

                        <DialogFooter className={"flex w-full justify-between"}>
                            <Button
                                type="submit"
                                className="hover:cursor-pointer"
                                disabled={isPending || !form.formState.isValid}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Импорт...
                                    </>
                                ) : (
                                    "Импортировать"
                                )}
                            </Button>

                            <div className={"ml-auto"}>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => handleOpenChange(false)}
                                    className="hover:cursor-pointer"
                                >
                                    Отмена
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UserAddRepoDialog;
