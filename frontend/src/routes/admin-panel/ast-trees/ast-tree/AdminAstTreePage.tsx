import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    $adminAstTree,
    $adminAstTreeId, $adminAstTreeQueryOptions, $adminAstTreeView, $showEditAstTreeDialog,
    type ApiEntityAstTreeModel, type ApiEntityAstTreeViewModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import EditAstTreeDialog from "@/components/dialogs/EditAstTreeDialog.tsx";
import {columnsAstTrees} from "@/columns/columnsAstTrees.tsx";
import {z} from "zod";
import {astTreeSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";
import {
    AstView
} from "@/routes/user-panel/user/repo-panel/repo/commit-panel/commit/file-panel/file/components/AstView.tsx";
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card.tsx";

function AdminAstTreePageContent(props: {
    data: ApiEntityAstTreeModel,
    view: ApiEntityAstTreeViewModel
}) {
    const setShowEditAstTreeDialog = useSetAtom($showEditAstTreeDialog)
    const navigate = useNavigate()

    const {mutate} = $api.useMutation(
        'patch',
        '/admin/ast_trees/{astTreeId}'
    )

    const onSave = useCallback(async (data: z.infer<typeof astTreeSchema>) => {
        mutate({
            params: {
                path: {
                    astTreeId: props.data.id!
                }
            },
            body: {
                createdAt: data.createdAt.toISOString(),
            }
        }, {
            onSuccess() {
                toast.info('AST-дерево изменено')
                queryClient.invalidateQueries({queryKey: $adminAstTreeQueryOptions(props.data.id!).queryKey});
                setShowEditAstTreeDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    return (
        <>
            <EditAstTreeDialog data={props.data} onSave={onSave}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.id}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsAstTrees}
                    />

                    <div className={"flex flex-wrap gap-2"}>
                        <Button variant="outline" onClick={() => {
                            setShowEditAstTreeDialog(true)
                        }}>
                            Настройка AST-дерева
                        </Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/files?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'hash',
                                    params: {
                                        value: props.data.id
                                    }
                                }
                            ]))
                        }>Фильтр файлов</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/ast-nodes?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'tree',
                                    params: {
                                        value: props.data.id
                                    }
                                }
                            ]))
                        }>Фильтр AST-узлов</Button>
                    </div>

                    <Card className={"gap-2"}>
                        <CardHeader className={"font-mono text-sm"}>
                            Узлов: {props.view!.size} &middot; Глубина: {props.view!.depth}
                        </CardHeader>
                        <CardContent>
                            <AstView data={props.view} search={false} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

function AdminAstTreePage() {
    const adminAstTreeId = useParams()['adminAstTreeId']
    const setSelectedAdminAstTreeId = useSetAtom($adminAstTreeId)
    const adminAstTree = useAtomValue($adminAstTree)
    const adminAstTreeView = useAtomValue($adminAstTreeView)

    useEffect(() => {
        setSelectedAdminAstTreeId(adminAstTreeId!)
    }, [setSelectedAdminAstTreeId, adminAstTreeId]);

    return (
        <BatchLoader states={[adminAstTree, adminAstTreeView]}
                     loadingMessage={"Загрузка AST-дерева"}
                     display={() =>
                         <AdminAstTreePageContent data={loaded(adminAstTree).data} view={loaded(adminAstTreeView).data}/>
                     }
        />
    )
}

export default AdminAstTreePage;
