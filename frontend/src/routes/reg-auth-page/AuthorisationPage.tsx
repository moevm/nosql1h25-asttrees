import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Схемы валидации
const loginSchema = z.object({
    login: z.string().min(3, "Минимум 3 символа"),
    password: z.string().min(6, "Минимум 6 символов"),
});

const registrationSchema = z.object({
    login: z.string().min(3, "Минимум 3 символа"),
    email: z.string().email("Неверный email"),
    password: z.string().min(6, "Минимум 6 символов"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registrationSchema>;

function AuthorisationPage() {
    const [tab, setTab] = useState("authorisation");

    // Авторизация
    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: "",
            password: "",
        },
    });

    const handleLogin = (data: LoginValues) => {
        console.log("Вход:", data);
    };

    // Регистрация
    const registerForm = useForm<RegisterValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            login: "",
            email: "",
            password: "",
        },
    });

    const handleRegister = (data: RegisterValues) => {
        console.log("Регистрация:", data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Tabs value={tab} onValueChange={setTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="authorisation">Авторизация</TabsTrigger>
                    <TabsTrigger value="registration">Регистрация</TabsTrigger>
                </TabsList>

                {/* Авторизация */}
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
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Логин</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Введите ваш логин" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={loginForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Введите ваш пароль" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <div className="flex w-full items-center">
                                        <Button type="submit">Войти</Button>
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

                {/* Регистрация */}
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
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Логин</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Введите ваш логин" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Введите ваш email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Введите ваш пароль" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <div className="flex w-full items-center">
                                        <Button type="submit">Зарегистрироваться</Button>
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