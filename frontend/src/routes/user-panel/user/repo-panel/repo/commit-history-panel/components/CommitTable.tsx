import type {ApiCommitModel} from "@/store.ts";
import {Label} from "@/components/ui/label.tsx";

function CommitTable({data}: { data: ApiCommitModel[] }) {
    return (
        <div>
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded-2xl overflow-hidden border-gray-200">
                <tbody>
                {data?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-300 hover:cursor-pointer">
                        <td className="py-2 px-4 border-b border-gray-200 flex items-center gap-2">
                            <div className="flex justify-between w-full">
                                <div className="flex items-center gap-2 flex-grow">
                                    <Label className={"font-bold"}>
                                        {item.author}
                                    </Label>
                                    <Label className={"text-gray-400"}>
                                        {item.message}
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2 ml-auto">
                                    <Label className={"text-gray-400"}>
                                        {item.hash}
                                    </Label>
                                    <Label className={"text-gray-400"}>
                                        {new Date(item.createdAt)?.toLocaleDateString("ru-RU")}
                                    </Label>
                                </div>
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