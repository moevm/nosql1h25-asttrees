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
        navigate(`?path=${(path === '' ? '' : (path + '/')) + name}`)
    }, [path])

    const handleReturn = useCallback(() => {
        if (path) {
            const lastSlashIndex = path.lastIndexOf('/');
            const newPath = lastSlashIndex !== -1 ? path.substring(0, lastSlashIndex) : '';
            navigate(`?path=${newPath}`)
        }
    }, [path])

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
        navigate(`/users/${userId}/repo/${repId}/branch/${branchId}/commit/latest`)
    }

    return (
        <div>
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
                            <SelectLabel>Branches</SelectLabel>
                            {data.branches?.map((item) => (
                                <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded-2xl overflow-hidden border-gray-200">
                <thead>
                <tr className="bg-[#F1F5F9]">
                    <th className="flex justify-between text-left py-2 px-4 gap-2">
                        <div className={"flex justify-center gap-2"}>
                            <Label className={"font-bold"}>
                                {data.commit?.author}
                            </Label>
                            <Label className={"text-gray-400"}>
                                {data.commit?.message}
                            </Label>
                        </div>

                        <div className={"flex justify-center gap-2"}>
                            <Label className={"text-gray-400"}>
                                {data.commit?.hash}
                            </Label>
                            <Label className={"text-gray-400"}>
                                {new Date(data.commit?.createdAt)?.toLocaleDateString("ru-RU")}
                            </Label>
                            <Link
                                to={`/users/${data.owner?.id}/repo/${data.repository?.id}/branch/${data.branch?.id}/commits`}>
                                <Button variant="ghost" className={"hover:cursor-pointer hover:underline"}>
                                    <History/> {getCommitLabel(data.commitCount)}
                                </Button>
                            </Link>
                        </div>

                    </th>
                </tr>
                </thead>
                <tbody>
                {path !== '' && (
                    <tr className="hover:bg-gray-300 hover:underline hover:cursor-pointer">
                        <td className="py-2 px-4 border-b border-gray-200 flex items-center gap-2"
                            onClick={handleReturn}>
                            <Folder/>
                            ..
                        </td>
                    </tr>
                )}
                {data.files?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-300 hover:underline hover:cursor-pointer">
                        <td
                            className="py-2 px-4 border-b border-gray-200 flex items-center gap-2 cursor-pointer"
                            onClick={item.type === "FILE" ? () => window.location.href = `/users/${data.owner?.id}/repo/${data.repository?.id}/branch/${data.branch?.id}/commit/${data.commit?.id}/file/${item.id}` : () => handleDirectory(item.name)}>
                            <div className="flex items-center gap-2">
                                {item.type === "FILE" ? <File/> : <Folder/>}
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