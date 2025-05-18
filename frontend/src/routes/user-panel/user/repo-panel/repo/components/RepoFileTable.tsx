import {Label} from "@/components/ui/label.tsx";
import {File, Folder, History} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link, useLocation} from "react-router-dom";
import type {ApiRepositoryViewModel} from "@/store/store.ts";
import {loaded} from "@/api";

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
    const location = useLocation();
    console.log(data)
    //TODO add styles and info from back in header
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
                {data.files?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-300 hover:underline hover:cursor-pointer">
                        <td className="py-2 px-4 border-b border-gray-200 flex items-center gap-2">
                            {item.type === "FILE" ? (
                                <a href={`/users/${data.owner?.id}/repo/${data.repository?.id}/branch/${data.branch?.id}/commit/${data.commit?.id}/file/${item.id}`}
                                   className="flex items-center gap-2">
                                    <File/>
                                    {item.name}
                                </a>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Folder/>
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