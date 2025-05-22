import type {ApiCommitModel, ApiRepositoryViewModel} from "@/store/store.ts";
import {Label} from "@/components/ui/label.tsx";
import {Link, useNavigate} from "react-router-dom";

function CommitTable({repo, data}: {
    repo: ApiRepositoryViewModel,
    data: ApiCommitModel[]
}) {
    const navigate = useNavigate()

    return (
        <div className="mt-5">
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded overflow-hidden border-border bg-background">
                <tbody>
                {data?.map((item) => (

                    <tr
                        onClick={() => navigate(`/users/${repo.owner?.id}/repo/${repo.repository?.id}/branch/${repo.branch?.id}/commit/${item.id}`, { replace: false })}
                        key={item.id}
                        className="hover:bg-accent cursor-pointer transition-colors"
                    >
                        <td className="py-4 px-4 border-b border-gray-200 w-1/4">
                            <Label className="font-bold whitespace-nowrap ">
                                {item.author}
                            </Label>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 w-2/4">
                            <Label className="text-primary/60 whitespace-nowrap ">
                                {item.message}
                            </Label>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 w-1/4">
                            <div className="flex justify-end items-center gap-4">
                                <Label className="text-primary/60 whitespace-nowrap font-mono">
                                    {String(item.hash).substring(0, 6)}
                                </Label>
                                <Label className="text-primary/60 whitespace-nowrap w-[90px]">
                                    {new Date(item.createdAt)?.toLocaleDateString("ru-RU")}
                                </Label>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default CommitTable
