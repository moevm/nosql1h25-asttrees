import {Outlet, useParams} from "react-router-dom";
import {useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {$branchId, $commitId, $repoId} from "@/store/store.ts";

function RepoLayout() {
    const repoId = useParams()['repoId']
    const setRepoId = useSetAtom($repoId)

    useEffect(() => {
        setRepoId(repoId!)
    }, [setRepoId, repoId]);

    const branchId = useParams()['branchId']
    const setBranchId = useSetAtom($branchId)

    useEffect(() => {
        setBranchId(branchId!)
    }, [setBranchId, branchId]);

    const commitId = useParams()['commitId']
    const setCommitId = useSetAtom($commitId)

    useEffect(() => {
        setCommitId(commitId!)
    }, [setCommitId, commitId]);

    return (
        <Outlet/>
    )
}

export default RepoLayout