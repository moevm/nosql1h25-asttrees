import {useState} from "react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useQueryClient} from "@tanstack/react-query";
import {$api, createMutationOptions} from "@/api";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {Loader2} from "lucide-react";
import {useNavigate} from "react-router-dom";

// Схемы валидации
const loginSchema = z.object({
    login: z.string().min(3, {message: "Минимум 3 символа"}),
    password: z.string().min(5, {message: "Минимум 5 символов"}),
});

const registrationSchema = z.object({
    login: z.string().min(3, {message: "Минимум 3 символа"}),
    email: z.string().email("Неверный email"),
    password: z.string().min(5, {message: "Минимум 5 символов"}),
});

function AuthorisationPage() {
    const [tab, setTab] = useState("authorisation");
    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const {mutate: mutateRegister, isPending: isPendingRegister} = $api.useMutation('post', '/auth/register', createMutationOptions({
        onSuccess: async (data: any) => {
            console.log("success", data);
            navigate(`/users/${data.username}`)
        },
        onError: async (data: any) => {
            if (data.error == "username already exists") {
                toast.error("Пользователь с таким логином уже существует");
            } else {
                toast.error(data);
            }
            console.log("error", data);
        }
    }))

    const {mutate: mutateLogin, isPending: isPendingLogin} = $api.useMutation('post', '/auth/login', createMutationOptions({
        onSuccess: async (data: any) => {
            console.log(data);
            navigate(`/users/${data.username}`)
        },
        onError: async (data: any) => {
            if (data.error == "username already exists") {
                toast.error("Пользователь с таким логином уже существует");
            } else {
                toast.error(data);
            }
            console.log(data);
        }
    }))

    // Авторизация
    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: "",
            password: "",
        },
        disabled: isPendingLogin
    });

    const handleLogin = (values: z.infer<typeof loginSchema>) => {
        mutateRegister({
            body: {
                username: values.login,
                password: values.password
            }
        });
        console.log("Логин:", values);
    };

    // Регистрация
    const registerForm = useForm<z.infer<typeof registrationSchema>>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            login: "",
            email: "",
            password: "",
        },
        disabled: isPendingRegister
    });

    const handleRegister = (values: z.infer<typeof registrationSchema>) => {
        mutateRegister({
            body: {
                username: values.login,
                email: values.email,
                password: values.password
            }
        });
        console.log("Регистрация:", values);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Tabs value={tab} onValueChange={setTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="authorisation">Авторизация</TabsTrigger>
                    <TabsTrigger value="registration">Регистрация</TabsTrigger>
                </TabsList>

                <TabsContent value="authorisation">
                    <Card className={""}>
                        <CardHeader>
                            <CardTitle>Добро пожаловать!</CardTitle>
                            <CardDescription>
                                Войдите или зарегистрируйтесь.
                            </CardDescription>
                        </CardHeader>
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                                <CardContent className="space-y-2 py-4">
                                    <FormField
                                        control={loginForm.control}
                                        name="login"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Логин</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Введите ваш логин" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={loginForm.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <Input type="password"
                                                           placeholder="Введите ваш пароль" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <div className="flex w-full items-center">
                                        <Button type="submit" disabled={isPendingLogin}>
                                            {isPendingLogin
                                                ? <>
                                                    <Loader2 className="animate-spin"/>
                                                    Загрузка</>
                                                : <>
                                                    Войти
                                                </>
                                            }
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setTab("registration")}
                                            variant="link"
                                            className="ml-auto text-sm text-muted-foreground hover:underline"
                                        >
                                            Еще нет аккаунта?
                                        </Button>
                                    </div>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>

                <TabsContent value="registration">
                    <Card>
                        <CardHeader>
                            <CardTitle>Регистрация</CardTitle>
                            <CardDescription>
                                Создайте новый аккаунт.
                            </CardDescription>
                        </CardHeader>
                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                                <CardContent className="space-y-2 py-4">
                                    <FormField
                                        control={registerForm.control}
                                        name="login"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Логин</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Введите ваш логин" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Введите ваш email" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <Input type="password"
                                                           placeholder="Введите ваш пароль" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <div className="flex w-full items-center">
                                        <Button type="submit" disabled={isPendingRegister}>
                                            {isPendingRegister
                                                ? <>
                                                    <Loader2 className="animate-spin"/>
                                                    Загрузка</>
                                                : <>
                                                    Зарегестрироваться
                                                </>
                                            }
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setTab("authorisation")}
                                            variant="link"
                                            className="ml-auto text-sm text-muted-foreground hover:underline"
                                        >
                                            Уже есть аккаунт?
                                        </Button>
                                    </div>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AuthorisationPage;