import {useCallback, useEffect} from "react";

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
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Loader2} from "lucide-react";
import {atom, useAtom} from "jotai";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useLoginMutation, useRegisterMutation} from "@/api/auth.ts";
import {$currentUser, $currentUserQuery} from "@/store/store.ts";
import {useNavigate, useParams} from "react-router-dom";
import {loaded} from "@/api";

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

function RegisterPage() {
    const navigate = useNavigate();
    const {
        mutate,
        isPending
    } = useRegisterMutation()

    // Регистрация
    const registerForm = useForm<z.infer<typeof registrationSchema>>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            login: "",
            email: "",
            password: "",
        },
        disabled: isPending
    });

    const handleRegister = useCallback((values: z.infer<typeof registrationSchema>) => {
        mutate({
            body: {
                username: values.login,
                email: values.email,
                password: values.password
            }
        });
    }, [mutate]);

    return (
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
                                        <Input autoComplete="username" placeholder="Введите ваш логин" {...field} />
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
                                        <Input autoComplete="email" placeholder="Введите ваш email" {...field} />
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
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? <>
                                        <Loader2 className="animate-spin"/>
                                        Загрузка</>
                                    : <>
                                        Зарегистрироваться
                                    </>
                                }
                            </Button>
                            <Button
                                type="button"
                                onClick={() => navigate("/auth/login")}
                                variant="link"
                                className="ml-auto text-sm text-muted-foreground"
                            >
                                Уже есть аккаунт?
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

function LoginPage() {
    const navigate = useNavigate()
    const {
        mutate,
        isPending
    } = useLoginMutation()

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: "",
            password: "",
        },
        disabled: isPending
    });

    const handleLogin = useCallback((values: z.infer<typeof loginSchema>) => {
        mutate({
            body: {
                username: values.login,
                password: values.password
            }
        });
    }, [mutate]);

    return (
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
                                        <Input autoComplete="username" placeholder="Введите ваш логин" {...field} />
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
                            <Button type="submit" disabled={isPending}>
                                {isPending
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
                                onClick={() => navigate("/auth/registration")}
                                variant="link"
                                className="ml-auto text-sm text-muted-foreground"
                            >
                                Еще нет аккаунта?
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

function AuthorisationPage() {
    const currentUser = useAtomValue($currentUser)
    const navigate = useNavigate()
    const { tab } = useParams();

    useEffect(() => {
        console.info({
            currentUser
        })
        if (currentUser.state === 'hasData') {
            console.info('nav to user id')
            navigate('/users/' + loaded(currentUser).data.id, { replace: false });
        }
    }, [currentUser]);


    // useEffect(() => {
    //     navigate(`/${tab}`, { replace: false });
    // }, [tab, navigate]);

    return (
        <div className="flex justify-center items-center flex-1">
            <Tabs value={tab} onValueChange={(value) => navigate('/auth/' + value)} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Авторизация</TabsTrigger>
                    <TabsTrigger value="registration">Регистрация</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <LoginPage />
                </TabsContent>

                <TabsContent value="registration">
                    <RegisterPage />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AuthorisationPage;
