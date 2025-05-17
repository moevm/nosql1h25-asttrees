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
import {$currentUser, $currentUserQuery} from "@/store.ts";
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

const $tab = atom<string>('login')

function RegisterPage() {
    const setTab = useSetAtom($tab)
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
        console.log("Регистрация:", values);
    }, []);

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
                            <Button type="submit" disabled={isPending}>
                                {isPending
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
                                onClick={() => setTab("login")}
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
    )
}

function LoginPage() {
    const setTab = useSetAtom($tab)
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
    )
}

function AuthorisationPage() {
    const [tab, setTab] = useAtom($tab)
    const currentUser = useAtomValue($currentUser)
    const navigate = useNavigate()
    const { tabParam } = useParams();

    useEffect(() => {
        if (currentUser.state === 'hasData') {
            navigate('/users/' + loaded(currentUser).data.id, { replace: true });
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (tabParam) {
            setTab(tabParam);
        }
    }, [tabParam, setTab]);

    useEffect(() => {
        navigate(`/${tab}`);
    }, [tab, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Tabs value={tab} onValueChange={setTab} className="w-[400px]">
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
