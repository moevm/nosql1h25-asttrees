import {Button} from "@/components/ui/button.tsx"
import {Link, useNavigate} from "react-router-dom"
import {$currentUser, $currentUserQueryOptions} from "@/store/store.ts";
import {useAtomValue, useSetAtom} from "jotai/react";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {$authToken, queryClient} from "@/api";
import {useAtom} from "jotai";


function Header() {
    const currentUser = useAtomValue($currentUser)!
    const navigate = useNavigate()
    const [token, setToken] = useAtom($authToken)

    return (
        <header
            className="fixed z-50 w-full border-b bg-white px-10 py-2 border-grid">
            <div className="flex h-14 items-center gap-2 md:gap-4">
                <Link to={'/'} className="text-[32px] leading-tight">
                    <span className="font-bold">Sweet</span>Git
                </Link>
                <div className="ml-auto flex gap-2">
                    {currentUser.state === 'hasData' && currentUser.data.isAdmin && (
                        <Button variant={"destructive"} onClick={() => navigate('/admin')}>Админ-панель</Button>
                    )}
                    {currentUser.state === 'hasData' && (
                        <Button variant={"secondary"} onClick={() => {
                            queryClient.removeQueries({queryKey: $currentUserQueryOptions(true).queryKey});
                            setToken(null);
                        }}>Выход</Button>
                    )}
                    {token === null && (
                        <Button variant={"secondary"} onClick={() => navigate('/auth/login')}>Авторизация</Button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
