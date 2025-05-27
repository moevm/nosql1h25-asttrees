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
        return () => {
            setRepoId(null)
        }
    }, [setRepoId, repoId]);

    const branchId = useParams()['branchId']
    const setBranchId = useSetAtom($branchId)

    useEffect(() => {
        setBranchId(branchId!)
        return () => {
            setBranchId(null)
        }
    }, [setBranchId, branchId]);

    const commitId = useParams()['commitId']
    const setCommitId = useSetAtom($commitId)

    useEffect(() => {
        setCommitId(commitId!)
        return () => {
            setCommitId(null)
        }
    }, [setCommitId, commitId]);

    const path = searchParams.get('path') ?? ''
    const setPath = useSetAtom($path)

    useEffect(() => {
        setPath(path)
        return () => {
            setPath('')
        }
    }, [setPath, path]);

    return (
        <Outlet/>
    )
}

export default RepoLayout
