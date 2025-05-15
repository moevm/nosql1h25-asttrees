import {useAtomValue} from "jotai/react";
import {$userId} from "@/store.ts";

function RepoFileTable(props: {
    data: string[]
}) {
    const userId = useAtomValue($userId)!
    //TODO add styles and info from back in header
    return (
        <table className="min-w-full border-collapse border rounded-md border-gray-200">
            <thead>
            <tr className="bg-[#F1F5F9]">
                <th className="text-left py-2 px-4">{$userId}</th>
            </tr>
            </thead>
            <tbody>
            {props.data.map((fileName, index) => (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200">{fileName}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default RepoFileTable