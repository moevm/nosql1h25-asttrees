import {useAtomValue} from "jotai/react";
import {$userId} from "@/store.ts";
import {Label} from "@/components/ui/label.tsx";
import type {RepoFileProps} from "@/types/RepoFileProps.ts";
import {File, Folder, History} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

function RepoFileTable({data}: { data: RepoFileProps[] }) {
    const userId = useAtomValue($userId)!
    const lastCommitN = data.length - 1;
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
                                {userId}
                            </Label>
                            <Label className={"text-gray-400"}>
                                {data[lastCommitN].hash}
                            </Label>
                        </div>

                        <div className={"flex justify-center gap-2"}>
                            <Label className={"text-gray-400"}>
                                {data[lastCommitN].hash}
                            </Label>
                            <Label className={"text-gray-400"}>
                                {new Date(data[lastCommitN].createdAt)?.toLocaleDateString("ru-RU")}
                            </Label>
                            <Button variant="ghost" className={"hover:cursor-pointer hover:underline"}>
                                <History/> {data.length} Коммит(ов)
                            </Button>
                        </div>

                    </th>
                </tr>
                </thead>
                <tbody>
                {data[lastCommitN]?.rootFiles?.map((item) => (
                    <tr key={item.Items.id} className="hover:bg-gray-300 hover:underline hover:cursor-pointer">
                        <td className="py-2 px-4 border-b border-gray-200 flex items-center gap-2">
                            {item.Items.type === "FILE" ? (
                                <File/>
                            ) : (
                                <Folder/>
                            )}
                            {item.Items.name}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default RepoFileTable