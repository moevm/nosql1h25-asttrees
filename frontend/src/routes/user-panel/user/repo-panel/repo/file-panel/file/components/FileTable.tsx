import {type ApiCommitModel} from "@/store/store.ts";
import {Label} from "@/components/ui/label.tsx";
import {History} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {useState} from "react";

function RepoHeader({data}: { data: ApiCommitModel[] }) {
    const lastCommitN = data.length - 1;
    return (
        <div className="pb-5">
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
                            <Button variant="ghost" className={"hover:cursor-pointer hover:underline"}>
                                <History/> {data.length} Коммит(ов)
                            </Button>
                        </div>

                    </th>
                </tr>
                </thead>
            </table>
        </div>
    )
}

function FileTable({data}: { data: ApiCommitModel[] }) {
    const [selectedTab, setSelectedTab] = useState("code")

    const handleTabChange = (value) => {
        setSelectedTab(value);
    };


    return (
        <div>
            <RepoHeader data={data}/>
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded-2xl overflow-hidden border-gray-200">
                <thead>
                <tr className="bg-[#F1F5F9]">
                    <th className="flex justify-between text-left py-2 px-4 gap-2 items-center">
                        <div className={"flex justify-center gap-2 items-center"}>
                            <Tabs defaultValue={selectedTab} onValueChange={handleTabChange} className="w-[300px]">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="code"
                                                 className="hover:bg-gray-200 transition-colors duration-200">Код</TabsTrigger>
                                    <TabsTrigger value="AST"
                                                 className="hover:bg-gray-200 transition-colors duration-200">AST</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            15 строк &middot; 213 байт
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {selectedTab === "code" ? (

                    <tr>
                        <td colSpan={2} className="py-4 px-4">
                            <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                    <pre className="whitespace-pre-wrap">
                        <code>
                            {`1. function helloWorld() {\n`}
                            {`2.     console.log("Hello, world!");\n`}
                            {`3. }\n`}
                            {`4. \n`}
                            {`5. helloWorld();`}
                        </code>
                    </pre>
                            </div>
                        </td>
                    </tr>
                ) : (
                    <tr>
                        <td colSpan={2} className="py-4 px-4">
                            <div>
                                Assstt
                            </div>
                        </td>
                    </tr>
                )
                }
                </tbody>
            </table>
        </div>
    )
}

export default FileTable