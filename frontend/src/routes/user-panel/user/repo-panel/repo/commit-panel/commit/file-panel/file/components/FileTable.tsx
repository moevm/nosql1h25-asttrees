import {
    $astQuery, $astSearch,
    $astSearchQuery,
    type ApiFileAstModel,
    type ApiFileContentModel,
    type ApiRepositoryViewModel
} from "@/store/store.ts";
import {Label} from "@/components/ui/label.tsx";
import {ChevronDown, ChevronsUpDown, ChevronUp, Eye, History, Search, X} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import hljs from 'highlight.js';
import {type Loadable} from "jotai/utils";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {loaded} from "@/api";
import {type NodeRendererProps, Tree} from 'react-arborist';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useAtomValue, useSetAtom} from "jotai/react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {useAtom} from "jotai";

const REFERENCE_TYPES = new Set([
    'TypeParameter',
    'SUPER_TYPE',
    'RETURN_TYPE',
    'TYPE_ARGUMENT',
    'Annotation',
    'VARIABLE_TYPE',
    'ConstructorCall',
    'INTERFACE',
    'TypeAccess',
    'SUPER_INTERFACES',

])

const DECLARATION_TYPES = new Set([
    'Class',
    'Interface'
])


function RepoHeader({repo}: { repo: ApiRepositoryViewModel }) {
    return (
        <div className="pb-5">
            <table
                className="w-full table-fixed border-separate border-spacing-0 border rounded overflow-hidden border-border">
                <thead>
                <tr className="bg-slate-100">
                    <th className="flex justify-between text-left py-2 px-4 gap-2 items-center">
                        <div className={"text-sm truncate flex gap-2 items-center"}>
                            <span className={"whitespace-nowrap"}>
                                {repo.commit?.author}
                            </span>
                            <span className={"text-primary/60 truncate"}>
                                {repo.commit?.message}
                            </span>
                        </div>

                        <div className={"text-sm flex gap-2 items-center"}>
                            <span className={"text-primary/60 font-mono whitespace-nowrap"}>
                                {repo.commit?.hash && String(repo.commit?.hash).substring(0, 6)}
                            </span>
                            <span className={"text-primary/60 whitespace-nowrap"}>
                                {new Date(repo.commit?.createdAt)?.toLocaleDateString("ru-RU")}
                            </span>
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

function AstLabelRenderer({label, type}: { label: string, type: string }) {
    return <div className={"flex items-center gap-2 font-mono text-xs"}>
        <span className={"rounded-full text-background px-2 py-0.5 bg-slate-700 whitespace-nowrap"}>{type}</span>
        <span className={"whitespace-nowrap"}>{label}</span>
    </div>
}

function AstNode({node, style, dragHandle}: NodeRendererProps<any>) {
    const setAstQuery = useSetAtom($astQuery)

    const {id, data} = node
    const {label, type} = data

    const includesDot = label.includes('.')
    const isDeclaration = DECLARATION_TYPES.has(type)
    const isReference = REFERENCE_TYPES.has(type)

    const refSearchAvailable = (isDeclaration || (includesDot && isReference))
    const declarationSearchAvailable = includesDot && isReference

    const anySearchAvailable = (refSearchAvailable || declarationSearchAvailable)

    return (
        <div
            style={style}
            ref={dragHandle}
            onClick={() => node.toggle()}
            className={"hover:bg-accent/50 rounded cursor-pointer flex items-center gap-2 text-xs"}
        >
            <span style={{width: 16, height: 16}}>
                 {node.children?.length !== 0 && (
                     !node.isOpen ? <ChevronDown size={16}/> : <ChevronUp size={16}/>
                 )}
            </span>
            <AstLabelRenderer label={label} type={type}/>
            {anySearchAvailable && (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant={"secondary"} className={"!p-1 h-auto ml-1"}>
                            <Search className={"size-[12px]"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {refSearchAvailable && <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            setAstQuery({
                                typename: label as string,
                                types: [...REFERENCE_TYPES]
                            })
                        }}>
                            Найти использования
                        </DropdownMenuItem>}
                        {declarationSearchAvailable && <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            setAstQuery({
                                typename: label as string,
                                types: [...DECLARATION_TYPES]
                            })
                        }}>
                            Найти объявления
                        </DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}

function FileTableContent({repo, fileContent, fileAst}: {
    repo: ApiRepositoryViewModel,
    fileContent: ApiFileContentModel,
    fileAst: Loadable<ApiFileAstModel>
}) {
    const astQueryResult = useAtomValue($astSearch)
    const [astQuery, setAstQuery] = useAtom($astQuery)
    const navigate = useNavigate()

    const [selectedTab, setSelectedTab] = useState("code")
    const highlightedCode = useMemo(() => {
        if (!fileContent.isBinary) {
            const extension = fileContent.commitFile!.name!.includes('.')
                ? fileContent.commitFile!.name!.substring(fileContent.commitFile!.name!.lastIndexOf('.') + 1).toLowerCase()
                : null

            const hasLang = extension && hljs.listLanguages().includes(extension)

            return hasLang
                ? hljs.highlight(extension, fileContent.content!).value
                : hljs.highlightAuto(fileContent.content!).value
        }
        return null
    }, [fileContent])

    return (
        <div>
            <RepoHeader repo={repo}/>
            <table
                className="w-full table-fixed border-separate border-spacing-0 border rounded overflow-hidden border-border">
                <thead>
                <tr className="bg-slate-100">
                    <th className="flex justify-between text-left py-2 px-4 gap-2 items-center" >
                        <div className={"flex justify-center gap-2 items-center"}>
                            {fileContent.hasAst &&
                                <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="code">Код</TabsTrigger>
                                        <TabsTrigger value="AST">AST</TabsTrigger>
                                    </TabsList>
                                </Tabs>}
                            {selectedTab === "code" ? (
                                <span
                                    className={"text-sm text-primary/60 font-medium leading-none py-3"}>{!fileContent.isBinary && <>Строк: {fileContent.lines} &middot; </>}Байт: {fileContent.bytes}</span>
                            ) : (
                                <BatchLoader states={[fileAst]} loadingMessage={'Загрузка AST-дерева'} display={() => (
                                    <span
                                        className={"text-sm text-primary/60 font-medium leading-none py-3"}>Узлов: {loaded(fileAst).data.astTree.size} &middot; Глубина: {loaded(fileAst).data.astTree.depth}</span>
                                )}/>
                            )}
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-background border-t border-border">
                {selectedTab === "code" ? (
                    <tr>
                        <td >
                            <div className="p-4 overflow-auto">
                                <pre className="whitespace-pre-wrap text-sm">
                                    <code>
                                        <div className="grid grid-cols-[auto_1fr] gap-1 text-xs">
                                            {
                                                !fileContent.isBinary
                                                    ? highlightedCode && highlightedCode.split('\n').map((line, index) => (
                                                    <React.Fragment key={index}>
                                                    <span
                                                        className="text-gray-500 text-right pr-4 font-mono select-none">
                                                        {index + 1}
                                                    </span>
                                                        <span dangerouslySetInnerHTML={{__html: line}}/>
                                                    </React.Fragment>
                                                ))
                                                    : <span>Бинарный файл</span>
                                            }
                                        </div>
                                    </code>
                                </pre>
                            </div>
                        </td>
                    </tr>
                ) : (
                    <BatchLoader states={[fileAst]} loadingMessage={'Загрузка AST-дерева'} display={() => (
                        <tr>
                            <td  className="py-4 px-4">
                                <div className={"flex min-w-0 w-full h-full gap-4 max-h-[600px]"}>
                                    <Tree
                                        rowHeight={22}
                                        height={600}
                                        disableDrag={true}
                                        disableEdit={true}
                                        disableDrop={true}
                                        width={'auto'}
                                        childrenAccessor={d => [...d.children].reverse()}
                                        initialData={loaded(fileAst).data.astTree.nodes}
                                    >
                                        {AstNode}
                                    </Tree>
                                    {astQuery && <Card className={"min-w-sm flex-2"}>
                                        <CardHeader>
                                            <CardTitle className={"flex justify-between items-center"}>
                                                <span>Поиск</span>
                                                <Button variant={"ghost"} className={"!p-1 h-auto"} onClick={() => setAstQuery(null)}>
                                                    <X />
                                                </Button>
                                            </CardTitle>
                                            <CardDescription>{
                                                (
                                                    astQueryResult.state === 'loading' ? 'Загрузка...' : (
                                                        astQueryResult.state === 'hasData' ? (
                                                            astQueryResult.data.length === 0 ? 'Результатов нет' : 'Элементов: ' + (astQueryResult.data.reduce((prev, cur) => prev + cur.nodes.length, 0))
                                                        ) : false
                                                    )
                                                )
                                            }</CardDescription>
                                        </CardHeader>
                                        <CardContent className={"overflow-auto h-full"}>
                                            <BatchLoader
                                                states={[astQueryResult]}
                                                loadingMessage={''}
                                                display={() => (
                                                    <div className={"flex flex-col gap-2"}>
                                                        {astQueryResult.data.map(item =>
                                                            <Collapsible>
                                                                <div>
                                                                    <div className={"flex items-center gap-1"}>
                                                                        <CollapsibleTrigger asChild>
                                                                            <Button variant="outline"
                                                                                    className={"!px-3"}>
                                                                                <ChevronsUpDown
                                                                                    className="size-[14px]"/>
                                                                            </Button>
                                                                        </CollapsibleTrigger>
                                                                        <Button variant="outline" className={"!px-3"}
                                                                                onClick={() => navigate(`/users/${repo.owner!.id}/repo/${repo.repository!.id}/branch/${repo.branch!.id}/commit/${repo.commit!.id}/file/${item.file.id}`)}>
                                                                            <Eye className="size-[14px]"/>
                                                                        </Button>
                                                                        <div className={"ml-1"}>
                                                                            <div
                                                                                className={"text-sm"}>{item.file.fullPath}</div>
                                                                            <div
                                                                                className={"text-xs text-muted-foreground"}>элементов: {item.nodes.length}</div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                                <CollapsibleContent>
                                                                    <div className={"flex flex-col gap-2 mt-2"}>
                                                                        {item.nodes.map(node => (
                                                                            <AstLabelRenderer label={node.label}
                                                                                              type={node.type}/>
                                                                        ))}
                                                                    </div>
                                                                </CollapsibleContent>

                                                            </Collapsible>
                                                        )}
                                                    </div>
                                                )}
                                            />

                                            <pre className={"text-xs"}>
                                        </pre>
                                        </CardContent>
                                    </Card>}
                                </div>

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
    const setAstSearch = useSetAtom($astQuery)
    useEffect(() => {
        if (fileAst.data) {
            setAstSearch(null)
        }
    }, [fileAst.data]);

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
