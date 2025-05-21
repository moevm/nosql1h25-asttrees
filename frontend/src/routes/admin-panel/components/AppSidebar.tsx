import {Sidebar, SidebarContent, SidebarGroup} from "@/components/ui/sidebar.tsx"
import {Button} from "@/components/ui/button.tsx";
import {NavLink} from "react-router";


function AppSidebar() {
    return (
        <div>
            <Sidebar className={"pt-18"}>
                <SidebarContent>
                    <SidebarGroup>
                        <Button asChild variant="ghost" className="justify-start px-3">
                            <NavLink to="users">
                                Пользователи
                            </NavLink>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start px-3">
                            <NavLink to="repos">
                                Репозитории
                            </NavLink>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start px-3">
                            <NavLink to="branches">
                                Ветки
                            </NavLink>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start px-3">
                            <NavLink to="commits">
                                Коммиты
                            </NavLink>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start px-3">
                            <NavLink to="files">
                                🚧 Файлы не тыкайте сюда 🚧
                            </NavLink>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start px-3">
                            <NavLink to="ast-trees">
                                🚧 AST-деревья не тыкайте сюда 🚧
                            </NavLink>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start px-3">
                            <NavLink to="import-export">
                                Импорт/Экспорт БД
                            </NavLink>
                        </Button>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>

    )
}

export default AppSidebar
