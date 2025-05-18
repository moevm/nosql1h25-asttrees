import {Button} from "@/components/ui/button.tsx"
import {Link} from "react-router-dom"
import {$currentUser} from "@/store/store.ts";
import {useAtomValue} from "jotai/react";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";


function Header() {
    const currentUser = useAtomValue($currentUser)!

    return (

            currentUser.state === 'hasData' ? (
                <header
                    className="fixed z-50 w-full border-b bg-background px-4 py-2 shadow border-grid backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-2 md:gap-4">
                        <Link to={`/users/${currentUser.data.id}`} className="px-8 text-4xl leading-tight">
                            <span className="font-bold">Sweet</span>Git
                        </Link>
                        <div className="ml-auto flex gap-2">
                            {currentUser.data.isAdmin && (
                                <Button className="hidden md:flex bg-red-800 hover:bg-red-950">Админ-панель</Button>
                            )}
                        </div>
                    </div>
                </header>
            ) : (
                    <header
                        className="fixed z-50 w-full border-b bg-background px-4 py-2 shadow border-grid backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex h-14 items-center gap-2 md:gap-4">
                            <Link to={`/`} className="px-8 text-4xl leading-tight">
                                <span className="font-bold">Sweet</span>Git
                            </Link>
                        </div>
                    </header>
            )
    )
}

export default Header