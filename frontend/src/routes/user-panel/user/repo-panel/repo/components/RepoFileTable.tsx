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
    }, [navigate, path])

    const handleReturn = useCallback(() => {
        if (path) {
            const lastSlashIndex = path.lastIndexOf('/');
            const newPath = lastSlashIndex !== -1 ? path.substring(0, lastSlashIndex) : '';
            navigate(`?path=${newPath}`)
        }
    }, [navigate, path])

    return (
        <div>
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded-sm overflow-hidden">
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
                            <Label className={"text-primary/60"}>
                                {data.commit?.hash}
                            </Label>
                            <Label className={"text-primary/60"}>
                                {new Date(data.commit?.createdAt)?.toLocaleDateString("ru-RU")}
                            </Label>
                            <Link to={`/users/${data.owner?.id}/repo/${data.repository?.id}/branch/${data.branch?.id}/commits`}>
                                <Button variant="ghost">
                                    <History/> {getCommitLabel(data.commitCount)}
                                </Button>
                            </Link>
                        </div>

                    </th>
                </tr>
                </thead>
                <tbody className="bg-background">
                {path !== '' && (
                    <tr className="hover:bg-accent/50 cursor-pointer" onClick={handleReturn}>
                        <td className="py-2 px-4 border-t border-gray-200 flex items-center gap-2">
                            <Folder />
                            ..
                        </td>
                    </tr>
                )}
                {data.files?.map((item) => (
                    <tr
                        key={item.id}
                        className="hover:bg-accent/50 cursor-pointer"
                        onClick={e => item.type === 'FILE' ? navigate(`/users/${data.owner?.id}/repo/${data.repository?.id}/branch/${data.branch?.id}/commit/${data.commit?.id}/file/${item.id}`) : handleDirectory(item.name)}
                    >
                        <td className="py-2 px-4 border-t flex items-center gap-2">
                            {item.type === "FILE" ? (
                                <div
                                   className="flex items-center gap-2">
                                    <File size={20}/>
                                    {item.name}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Folder size={20}/>
                                    {item.name}
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default RepoFileTable
