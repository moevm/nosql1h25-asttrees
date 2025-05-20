import {
    $fileAst,
    type ApiFileContentModel,
    type ApiRepositoryViewModel
} from "@/store/store.ts";
import {Label} from "@/components/ui/label.tsx";
import {History} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import React from "react";
import hljs from 'highlight.js';
import {useAtomValue} from "jotai/react";


function RepoHeader({repo}: { repo: ApiRepositoryViewModel }) {
    return (
        <div className="pb-5">
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded-2xl overflow-hidden border-gray-200">
                <thead>
                <tr className="bg-[#F1F5F9]">
                    <th className="flex justify-between text-left py-2 px-4 gap-2">
                        <div className={"flex justify-center gap-2"}>
                            <Label className={"font-bold"}>
                                {repo.commit?.author}
                            </Label>
                            <Label className={"text-gray-400"}>
                                {repo.commit?.message}
                            </Label>
                        </div>

                        <div className={"flex justify-center gap-2"}>
                            <Label className={"text-gray-400"}>
                                {repo.commit?.hash}
                            </Label>
                            <Label className={"text-gray-400"}>
                                {new Date(repo.commit?.createdAt)?.toLocaleDateString("ru-RU")}
                            </Label>
                            <Link
                                to={`/users/${repo.owner?.id}/repo/${repo.repository?.id}/branch/${repo.branch?.id}/commits`}>
                                <Button variant="ghost" className={"hover:cursor-pointer hover:underline"}>
                                    <History/> История коммитов
                                </Button>
                            </Link>
                        </div>
                    </th>
                </tr>
                </thead>
            </table>
        </div>
    )
}

function FileTable({repo, fileContent}: {
    repo: ApiRepositoryViewModel,
    fileContent: ApiFileContentModel
}) {
    const [selectedTab, setSelectedTab] = useState("code")
    const highlightedCode = useMemo(() => {
        if (!fileContent.isBinary && fileContent.commitFile!.type !== 'DIRECTORY') {
            return hljs.highlightAuto(
                fileContent.content!
            ).value
        }
        return null
    }, [fileContent])

    const astTree = useMemo(() => {
        if (fileContent.hasAst) {
            return useAtomValue($fileAst)!
        }
        return null
    }, [fileContent])

    return (
        <div>
            <RepoHeader repo={repo}/>
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded-2xl overflow-hidden border-gray-200">
                <thead>
                <tr className="bg-[#F1F5F9]">
                    <th className="flex justify-between text-left py-2 px-4 gap-2 items-center">
                        <div className={"flex justify-center gap-2 items-center"}>
                            <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-[300px]">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="code"
                                                 className="hover:bg-gray-200 transition-colors duration-200">Код</TabsTrigger>
                                    <TabsTrigger value="AST"
                                                 className="hover:bg-gray-200 transition-colors duration-200">AST</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <span>{fileContent.lines} строк &middot; {fileContent.bytes} байт</span>
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
                                        <div className="grid grid-cols-[auto_1fr] gap-1">
                                            {highlightedCode && highlightedCode.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>
                                                    <span className="text-gray-500 text-right pr-8 font-mono">
                                                        {index + 1}
                                                    </span>
                                                    <span dangerouslySetInnerHTML={{__html: line}} />
                                                </React.Fragment>
                                            ))}
                                        </div>
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