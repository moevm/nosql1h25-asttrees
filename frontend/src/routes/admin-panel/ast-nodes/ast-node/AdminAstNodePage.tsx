import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    $adminAstNode,
    $adminAstNodeId, $adminAstNodeQueryOptions, $adminBranchQueryOptions, $showEditAstNodeDialog,
    type ApiEntityAstNodeModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect, useState} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import EditAstNodeDialog from "@/components/dialogs/EditAstNodeDialog.tsx";
import {columnsAstNodes} from "@/columns/columnsAstNodes.tsx";
import {z} from "zod";
import {astNodeSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";
import {ListLinker} from "@/routes/admin-panel/components/ListLinker.tsx";

function AdminAstNodePageContent(props: {
    data: ApiEntityAstNodeModel
}) {
    const navigate = useNavigate()
    const setShowEditAstNodeDialog = useSetAtom($showEditAstNodeDialog)
    const [showEditChildrenDialog, setShowEditChildrenDialog] = useState(false)

    const {mutate} = $api.useMutation(
        'patch',
        '/admin/ast_nodes/{astNodeId}'
    )
    const {mutate: mutateSetLinks} = $api.useMutation(
        'post',
        '/admin/ast_nodes/{astNodeId}/children'
    )

    const onSave = useCallback(async (data: z.infer<typeof astNodeSchema>) => {
        mutate({
            params: {
                path: {
                    astNodeId: props.data.id!
                }
            },
            body: {
                type: data.type,
                label: data.label,
                tree: data.tree
            }
        }, {
            onSuccess() {
                toast.info('AST-узел изменён')
                queryClient.invalidateQueries({queryKey: $adminAstNodeQueryOptions(props.data.id!).queryKey});
                setShowEditAstNodeDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    const onSaveLinks = useCallback(async (data: string[]) => {
        mutateSetLinks({
            params: {
                path: {
                    astNodeId: props.data.id!
                },
            },
            body: {
                links: data
            }
        }, {
            onSuccess() {
                toast.info('AST-узел изменён')
                queryClient.invalidateQueries({queryKey: $adminAstNodeQueryOptions(props.data.id!).queryKey});
                setShowEditChildrenDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    return (
        <>
            <ListLinker open={showEditChildrenDialog} setOpen={setShowEditChildrenDialog} initialValue={props.data.children ?? []} onSave={onSaveLinks} />
            <EditAstNodeDialog data={props.data} onSave={onSave}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.id}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsAstNodes}
                    />
                    <div className={"flex flex-wrap gap-2"}>
                        <Button variant="outline" onClick={() => {
                            setShowEditAstNodeDialog(true)
                        }}>
                            Настройка AST-узла
                        </Button>
                        <Button variant={"outline"} onClick={() => {
                            setShowEditChildrenDialog(true)
                        }}>
                            Привязка потомков
                        </Button>
                        {props.data.parent && (
                            <Button variant="outline" onClick={() => {
                                navigate(`/admin/ast-nodes/${props.data.parent}`)
                            }}>
                                Перейти к родителю
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => {
                            navigate(`/admin/ast-trees/${props.data.tree}`)
                        }}>
                            Перейти к AST-дереву
                        </Button>
                        {props.data.parent && <Button variant="outline" onClick={() =>
                            navigate(`/admin/ast-nodes?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'id',
                                    params: {
                                        value: props.data.parent
                                    }
                                }
                            ]))
                        }>Фильтр родителя</Button>}
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/ast-nodes?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'parent',
                                    params: {
                                        value: props.data.id
                                    }
                                }
                            ]))
                        }>Фильтр потомков</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/ast-trees?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'id',
                                    params: {
                                        value: props.data.tree
                                    }
                                }
                            ]))
                        }>Фильтр AST-дерева</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

function AdminAstNodePage() {
    const adminAstNodeId = useParams()['adminAstNodeId']
    const setSelectedAdminAstNodeId = useSetAtom($adminAstNodeId)
    const adminAstNode = useAtomValue($adminAstNode)

    useEffect(() => {
        setSelectedAdminAstNodeId(adminAstNodeId!)
    }, [setSelectedAdminAstNodeId, adminAstNodeId]);

    return (
        <BatchLoader states={[adminAstNode]}
                     loadingMessage={"Загрузка AST-узла"}
                     display={() =>
                         <AdminAstNodePageContent data={loaded(adminAstNode).data}/>
                     }
        />
    )
}

export default AdminAstNodePage;
