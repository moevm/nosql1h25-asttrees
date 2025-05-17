import {Outlet, useParams} from "react-router-dom";
import {useSetAtom} from "jotai/react";
import {$userId} from "@/store/store.ts";
import {useEffect} from "react";


function UserLayout(){
    const userId = useParams()['userId']
    const setUserId = useSetAtom($userId)

    useEffect(() => {
        setUserId(userId!)
    }, [setUserId, userId]);

    return(
        <Outlet/>
    )
}

export default UserLayout