import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"


// TODO: можно конечно и оставить такую проверку, но лучше явно переделать потом
function Header() {
    const location = useLocation()
    const path = location.pathname

    return (
        <header className="fixed z-50 w-full border-b bg-background px-4 py-2 shadow border-grid backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-2 md:gap-4">
                    <span className="px-8 text-4xl leading-tight">
                        <span className="font-bold">Sweet</span>Git
                    </span>
                <div className="ml-auto flex gap-2">
                    {path === "/auth" && (
                        <Button className="hidden md:flex">Авторизация</Button>
                    )}
                    {path === "/auth" && (
                        <Button className="hidden md:flex">Регистрация</Button>
                    )}
                    {path.startsWith("/admin") && (
                        <Button className="hidden md:flex bg-red-800 hover:bg-red-950">Админ-панель</Button>
                    )}
                    {path !== "/auth" && (
                        <Button className="hidden md:flex">Профиль</Button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header