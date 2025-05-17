import type {ApiCommitModel} from "@/store.ts";
import {Label} from "@/components/ui/label.tsx";

function CommitTable({data}: { data: ApiCommitModel[] }) {
    return (
        <div className="mt-5">
            <table className="min-w-full table-fixed border-separate border-spacing-0 border rounded-2xl overflow-hidden border-gray-200">
                <tbody>
                {data?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-300 hover:cursor-pointer">
                        <td className="py-4 px-4 border-b border-gray-200 w-1/4">
                            <Label className="font-bold whitespace-nowrap hover:cursor-pointer">
                                {item.author}
                            </Label>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 w-2/4">
                            <Label className="text-gray-400 whitespace-nowrap hover:cursor-pointer">
                                {item.message}
                            </Label>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 w-1/4">
                            <div className="flex justify-end items-center gap-4">
                                <Label className="text-gray-400 whitespace-nowrap hover:cursor-pointer">
                                    {item.hash}
                                </Label>
                                <Label className="text-gray-400 whitespace-nowrap hover:cursor-pointer">
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