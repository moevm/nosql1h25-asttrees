
import {Outlet} from "react-router-dom";
import Header from "@/routes/header-layout/components/Header.tsx";

function HeaderLayout() {
    return (
        <div>
            <Header/>
            <main className={"pt-18"}>
                <Outlet />
            </main>
        </div>
    )
}

export default HeaderLayout