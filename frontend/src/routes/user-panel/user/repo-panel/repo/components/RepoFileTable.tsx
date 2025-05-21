import {Label} from "@/components/ui/label.tsx";
import {File, Folder, History} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import {$path, type ApiRepositoryViewModel} from "@/store/store.ts";
import {useAtomValue} from "jotai/react";
import {useCallback} from "react";

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

    return (
        <div>
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
                            <Link to={`/users/${data.owner?.id}/repo/${data.repository?.id}/branch/${data.branch?.id}/commits`}>
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
                        <td className="py-2 px-4 border-b border-gray-200 flex items-center gap-2" onClick={handleReturn}>
                            <Folder />
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
                                {item.type === "FILE" ? <File /> : <Folder />}
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