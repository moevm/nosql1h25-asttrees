import {$astQuery, type ApiEntityAstTreeViewModel} from "@/store/store.ts";
import {loaded} from "@/api";
import {type NodeRendererProps, Tree} from "react-arborist";
import React from "react";
import {useSetAtom} from "jotai/react";
import {ChevronDown, ChevronUp, Search} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";

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


export function AstLabelRenderer({label, type}: { label: string, type: string }) {
    return <div className={"flex items-center gap-2 font-mono text-xs"}>
        <span className={"rounded-full text-background px-2 py-0.5 bg-slate-700 whitespace-nowrap"}>{type}</span>
        <span className={"whitespace-nowrap"}>{label}</span>
    </div>
}

export function AstNode({node, style, dragHandle, search}: NodeRendererProps<any> & {search: boolean}) {
    const setAstQuery = useSetAtom($astQuery)

    const {id, data} = node
    const {label, type} = data

    const includesDot = label.includes('.')
    const isDeclaration = DECLARATION_TYPES.has(type)
    const isReference = REFERENCE_TYPES.has(type)

    const refSearchAvailable = (isDeclaration || (includesDot && isReference))
    const declarationSearchAvailable = includesDot && isReference

    const anySearchAvailable =search && (refSearchAvailable || declarationSearchAvailable)

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

export const AstView = ({ data, search }: {data: ApiEntityAstTreeViewModel, search: boolean}) => {
    return (
        <Tree
            rowHeight={22}
            height={600}
            disableDrag={true}
            disableEdit={true}
            disableDrop={true}
            width={'auto'}
            childrenAccessor={d => [...d.children].reverse()}
            initialData={data.nodes}
        >
            {((props) => AstNode({...props, search}))}
        </Tree>
    )
}
