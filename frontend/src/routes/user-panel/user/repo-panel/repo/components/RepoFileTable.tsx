import {Label} from "@/components/ui/label.tsx";
import {File, Folder, History} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import {$currentUser, $path, type ApiRepositoryViewModel} from "@/store/store.ts";
import {useAtomValue} from "jotai/react";
import {useCallback, useState} from "react";
import {Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectItem} from "@/components/ui/select.tsx";

const getCommitLabel = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) {
        return `${count} коммит`;
    } else if ((count % 10 >= 2 && count % 10 <= 4) && (count % 100 < 12 || count % 100 > 14)) {
        return `${count} коммита`;
    } else {
        return `${count} коммитов`;
    }
};

function RepoFileTable({data}: { data: ApiRepositoryViewModel }) {
    const navigate = useNavigate()
    const path = useAtomValue($path)
    const [selectedBranch, setSelectedBranch] = useState<string>(data.branch?.name)
    const curUser = useAtomValue($currentUser)

    const handleDirectory = useCallback((name: string) => {
        navigate(`?path=${(path === '' ? '' : (path + '/')) + name}`, { replace: false })
    }, [navigate, path])

    const handleReturn = useCallback(() => {
        if (path) {
            const lastSlashIndex = path.lastIndexOf('/');
            const newPath = lastSlashIndex !== -1 ? path.substring(0, lastSlashIndex) : '';
            navigate(`?path=${newPath}`, { replace: false })
        }
    }, [navigate, path])

    function findBranchIdByName(branchName: string | undefined, branches: typeof data.branches) {
        if (!branchName || !branches) return undefined;
        const branch = branches.find(item => item.name === branchName);
        return branch?.id;
    }

    function handleChanges(newBranchName: any){
        setSelectedBranch(newBranchName)
        const userId = curUser?.data?.id
        const branchId = findBranchIdByName(newBranchName, data.branches)
        const repId = data.repository?.id
        navigate(`/users/${userId}/repo/${repId}/branch/${branchId}/commit/latest`, { replace: false })
    }

    return (
        <div className={'flex flex-col gap-2'}>
            <div>
                <Select
                    defaultValue={selectedBranch}
                    value={selectedBranch}
                    onValueChange={handleChanges}
                >
                    <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Select a branch"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Ветка</SelectLabel>
                            {data.branches?.map((item) => (
                                <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <table
                className="min-w-full bg-background table-fixed border-separate border-spacing-0 border rounded overflow-hidden border">
                <thead>
                <tr className="bg-slate-100">
                    <th className="flex justify-between text-left py-2 px-4 gap-2">
                        <div className={"flex justify-center gap-2"}>
                            <Label className={"font-bold"}>
                                {data.commit?.author}
                            </Label>
                            <Label className={"text-primary/60"}>
                                {data.commit?.message}
                            </Label>
                        </div>

                        <div className={"flex justify-center gap-2"}>
                            <Label className={"text-primary/60 font-mono"}>
                                {data.commit?.hash && String(data.commit?.hash).substring(0, 6)}
                            </Label>
                            <Label className={"text-primary/60"}>
                                {new Date(data.commit?.createdAt)?.toLocaleDateString("ru-RU")}
                            </Label>
                            <Link
                                to={`/users/${data.owner?.id}/repo/${data.repository?.id}/branch/${data.branch?.id}/commits`}>
                                <Button variant="ghost">
                                    <History/> {getCommitLabel(data.commitCount)}
                                </Button>
                            </Link>
                        </div>

                    </th>
                </tr>
                </thead>
                <tbody>
                {path !== '' && (
                    <tr className="hover:bg-accent transition-colors cursor-pointer" onClick={handleReturn}>
                        <td className="py-2 px-4 border-t border-border flex items-center gap-2">
                            <Folder size={25}/>
                            ..
                        </td>
                    </tr>
                )}
                {data.files?.map((item) => (
                    <tr key={item.id} className="hover:bg-accent transition-colors cursor-pointer">
                        <td
                            className="py-2 px-4 border-t border-border flex items-center gap-2 cursor-pointer"
                            onClick={item.type === "FILE" ? () => navigate(`/users/${data.owner?.id}/repo/${data.repository?.id}/branch/${data.branch?.id}/commit/${data.commit?.id}/file/${item.id}`, { replace: false }) : () => handleDirectory(item.name)}>
                            <div className="flex items-center gap-2">
                                {item.type === "FILE" ? <File size={25}/> : <Folder size={25}/>}
                                {item.name}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default RepoFileTable
