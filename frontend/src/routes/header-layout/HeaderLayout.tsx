
import {Outlet} from "react-router-dom";
import Header from "@/components/custom/header/Header.tsx";

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