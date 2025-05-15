import {Outlet, useParams} from "react-router-dom";
import {useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {$repoId} from "@/store.ts";

function RepoLayout() {
    const repoId = useParams()['repoId']
    const setRepoId = useSetAtom($repoId)

    useEffect(() => {
        setRepoId(repoId!)
    }, [setRepoId, repoId]);

    return (
        <Outlet/>
    )
}

export default RepoLayout