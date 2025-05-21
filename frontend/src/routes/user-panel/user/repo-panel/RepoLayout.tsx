import {Outlet, useParams, useSearchParams} from "react-router-dom";
import {useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {$branchId, $commitId, $path, $repoId} from "@/store/store.ts";

function RepoLayout() {
    const repoId = useParams()['repoId']
    const setRepoId = useSetAtom($repoId)
    const [searchParams, setSearchParams] = useSearchParams();

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

    const path = searchParams.get('path') ?? ''
    const setPath = useSetAtom($path)

    useEffect(() => {
        setPath(path)
    }, [setPath, path]);

    return (
        <Outlet/>
    )
}

export default RepoLayout
