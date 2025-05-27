import {Outlet, useParams} from "react-router-dom";
import {useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {$fileId} from "@/store/store.ts";

function FileLayout() {
    const fileId = useParams()['fileId']
    const setFileId = useSetAtom($fileId)

    useEffect(() => {
        setFileId(fileId!)
    }, [setFileId, fileId]);

    return (
        <Outlet/>
    )
}

export default FileLayout