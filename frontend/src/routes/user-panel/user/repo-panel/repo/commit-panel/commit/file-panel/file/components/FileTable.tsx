import {
    type ApiFileAstModel,
    type ApiFileContentModel,
    type ApiRepositoryViewModel
} from "@/store/store.ts";
import {Label} from "@/components/ui/label.tsx";
import {ChevronDown, ChevronUp, History} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import React from "react";
import hljs from 'highlight.js';
import {type Loadable} from "jotai/utils";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import {type NodeRendererProps, Tree} from 'react-arborist';


function RepoHeader({repo}: { repo: ApiRepositoryViewModel }) {
    return (
        <div className="pb-5">
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded overflow-hidden border-border">
                <thead>
                <tr className="bg-slate-100">
                    <th className="flex justify-between text-left py-2 px-4 gap-2">
                        <div className={"flex justify-center gap-2"}>
                            <Label className={"font-bold"}>
                                {repo.commit?.author}
                            </Label>
                            <Label className={"text-primary/60"}>
                                {repo.commit?.message}
                            </Label>
                        </div>

                        <div className={"flex justify-center gap-2"}>
                            <Label className={"text-primary/60"}>
                                {repo.commit?.hash}
                            </Label>
                            <Label className={"text-primary/60"}>
                                {new Date(repo.commit?.createdAt)?.toLocaleDateString("ru-RU")}
                            </Label>
                            <Link
                                to={`/users/${repo.owner?.id}/repo/${repo.repository?.id}/branch/${repo.branch?.id}/commits`}>
                                <Button variant="ghost">
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

function AstNode({node, style, dragHandle}: NodeRendererProps<any>) {
    const {id, data} = node
    const {label, type} = data
    return (
        <div
            style={style}
            ref={dragHandle}
            onClick={() => node.toggle()}
            className={"font-mono hover:bg-accent/50 rounded cursor-pointer flex items-center gap-2 text-sm"}
        >
            <span style={{width: 16, height: 16}}>
                 {node.children?.length !== 0 && (
                     node.isOpen ? <ChevronDown size={16}/> : <ChevronUp size={16}/>
                 )}
            </span>
            <span className={"rounded-full bg-slate-800 text-background px-2 py-0.5"}>{type}</span>
            <span>{label}</span>
        </div>
    );
}

function FileTableContent({repo, fileContent, fileAst}: {
    repo: ApiRepositoryViewModel,
    fileContent: ApiFileContentModel,
    fileAst: Loadable<ApiFileAstModel>
}) {
    const [selectedTab, setSelectedTab] = useState("code")
    const highlightedCode = useMemo(() => {
        if (!fileContent.isBinary) {
            return hljs.highlightAuto(
                fileContent.content!
            ).value
        }
        return null
    }, [fileContent])

    return (
        <div>
            <RepoHeader repo={repo}/>
            <table
                className="min-w-full table-fixed border-separate border-spacing-0 border rounded overflow-hidden border-border">
                <thead>
                <tr className="bg-slate-100">
                    <th className="flex justify-between text-left py-2 px-4 gap-2 items-center">
                        <div className={"flex justify-center gap-2 items-center"}>
                            {fileContent.hasAst &&
                                <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="code">Код</TabsTrigger>
                                        <TabsTrigger value="AST">AST</TabsTrigger>
                                    </TabsList>
                                </Tabs>}
                            {selectedTab === "code" ? (
                                <span className={"text-sm text-primary/60 font-medium leading-none py-3"}>Строк: {fileContent.lines} &middot; Байт: {fileContent.bytes}</span>
                            ) : (
                                <BatchLoader states={[fileAst]} loadingMessage={'Загрузка AST-дерева'} display={() => (
                                    <span className={"text-sm text-primary/60 font-medium leading-none py-3"}>Узлов: {loaded(fileAst).data.astTree.nodes.length} &middot; Глубина: {loaded(fileAst).data.astTree.depth}</span>
                                )}/>
                            )}
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-background border-t border-border">
                {selectedTab === "code" ? (
                    <tr>
                        <td colSpan={2}>
                            <div className="p-4 overflow-auto">
                                <pre className="whitespace-pre-wrap text-sm">
                                    <code>
                                        <div className="grid grid-cols-[auto_1fr] gap-1">
                                            {highlightedCode && highlightedCode.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>
                                                    <span className="text-gray-500 text-right pr-4 font-mono select-none">
                                                        {index + 1}
                                                    </span>
                                                    <span dangerouslySetInnerHTML={{__html: line}}/>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </code>
                                </pre>
                            </div>
                        </td>
                    </tr>
                ) : (
                    <BatchLoader states={[fileAst]} loadingMessage={'Загрузка AST-дерева'} display={() => (
                        <tr>
                            <td colSpan={2} className="py-4 px-4 font-mono">
                                <BatchLoader
                                    states={[fileAst]}
                                    loadingMessage={'Загрузка AST-дерева'}
                                    display={() => (
                                        <Tree
                                            rowHeight={26}
                                            disableDrag={true}
                                            disableEdit={true}
                                            disableDrop={true}
                                            width={'auto'}
                                            initialData={loaded(fileAst).data.astTree.nodes}
                                        >
                                            {AstNode}
                                        </Tree>
                                    )}
                                />
                            </td>
                        </tr>
                    )}/>

                )
                }
                </tbody>
            </table>
        </div>
    )
}

function FileTable({repo, fileContent, fileAst}: {
    repo: Loadable<ApiRepositoryViewModel>,
    fileContent: Loadable<ApiFileContentModel>,
    fileAst: Loadable<ApiFileAstModel>
}) {
    return (
        <BatchLoader
            states={[repo, fileContent]}
            loadingMessage={'Загрузка репозитория'}
            display={() => <FileTableContent
                repo={loaded(repo).data}
                fileContent={loaded(fileContent).data}
                fileAst={fileAst}
            />}
        />
    )
}

export default FileTable
