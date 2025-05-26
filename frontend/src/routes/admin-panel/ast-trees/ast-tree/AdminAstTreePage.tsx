import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminAstTree,
    $adminAstTreeId, $adminAstTreeQueryOptions, $adminUserQueryOptions, $showEditAstTreeDialog,
    type ApiEntityAstTreeModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import EditAstTreeDialog from "@/components/dialogs/EditAstTreeDialog.tsx";
import {columnsAstTrees} from "@/columns/columnsAstTrees.tsx";
import {z} from "zod";
import {astTreeSchema, type userSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";

function AdminAstTreePageContent(props: {
    data: ApiEntityAstTreeModel
}) {
    const setShowEditAstTreeDialog = useSetAtom($showEditAstTreeDialog)

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
                queryClient.invalidateQueries({ queryKey: $adminAstTreeQueryOptions(props.data.id!).queryKey });
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
                    <Label className={"text-3xl"}>{props.data.commitFile?.name}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsAstTrees}
                    />
                    <div className={"flex justify-between gap-6"}>
                        <div className="flex justify-between gap-2">
                            <Button variant="outline" onClick={() => {
                                setShowEditAstTreeDialog(true)
                            }}>
                                Настройка AST-дерева
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function AdminAstTreePage() {
    const adminAstTreeId = useParams()['adminAstTreeId']
    const setSelectedAdminAstTreeId = useSetAtom($adminAstTreeId)
    const adminAstTree = useAtomValue($adminAstTree)

    useEffect(() => {
        setSelectedAdminAstTreeId(adminAstTreeId!)
    }, [setSelectedAdminAstTreeId, adminAstTreeId]);

    return (
        <BatchLoader states={[adminAstTree]}
                     loadingMessage={"Загрузка AST-дерева"}
                     display={() =>
                         <AdminAstTreePageContent data={loaded(adminAstTree).data}/>
                     }
        />
    )
}

export default AdminAstTreePage;
