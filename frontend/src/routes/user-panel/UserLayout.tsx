import {Outlet, useParams} from "react-router-dom";
import {useEffect} from "react";
import {useSetAtom} from "jotai/react";
import {$repoId, $userId} from "@/store/store.ts";


function UserLayout() {
    const userId = useParams()['userId']
    const setUserId = useSetAtom($userId)

    useEffect(() => {
        setUserId(userId!)
        return () => {
            setUserId(null)
        }
    }, [setUserId, userId]);

    return (
        <Outlet/>
    )
}

export default UserLayout
