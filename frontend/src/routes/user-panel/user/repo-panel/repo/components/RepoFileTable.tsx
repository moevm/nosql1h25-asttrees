import {type ApiCommitModel} from "@/store.ts";
import {Label} from "@/components/ui/label.tsx";
import {File, Folder, History} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link, useLocation} from "react-router-dom";

const getCommitLabel = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) {
        return `${count} коммит`;
    } else if ((count % 10 >= 2 && count % 10 <= 4) && (count % 100 < 12 || count % 100 > 14)) {
        return `${count} коммита`;
    } else {
        return `${count} коммитов`;
    }
};

function RepoFileTable({data}: { data: ApiCommitModel[] }) {
    const lastCommitN = data.length - 1;
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
                                {data[lastCommitN].author}
                            </Label>
                            <Label className={"text-gray-400"}>
                                {data[lastCommitN].message}
                            </Label>
                        </div>

                        <div className={"flex justify-center gap-2"}>
                            <Label className={"text-gray-400"}>
                                {data[lastCommitN].hash}
                            </Label>
                            <Label className={"text-gray-400"}>
                                {new Date(data[lastCommitN].createdAt)?.toLocaleDateString("ru-RU")}
                            </Label>
                            <Link to="history">
                                <Button variant="ghost" className={"hover:cursor-pointer hover:underline"}>
                                    <History/> {getCommitLabel(data.length)}
                                </Button>
                            </Link>
                        </div>

                    </th>
                </tr>
                </thead>
                <tbody>
                {data[lastCommitN]?.rootFiles?.map((item) => (
                    <tr key={item.Items.id} className="hover:bg-gray-300 hover:underline hover:cursor-pointer">
                        <td className="py-2 px-4 border-b border-gray-200 flex items-center gap-2">
                            {item.Items.type === "FILE" ? (
                                <a href={`${location.pathname}/file/${item.Items.name}`}
                                   className="flex items-center gap-2">
                                    <File/>
                                    {item.Items.name}
                                </a>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Folder/>
                                    {item.Items.name}
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