import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    $adminCommit, $adminCommitId, $adminCommitQueryOptions, $showEditCommitDialog,
    type ApiEntityCommitModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect, useState} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import EditCommitDialog from "@/components/dialogs/EditCommitDialog.tsx";
import {columnsCommits} from "@/columns/columnsCommits.tsx";
import {z} from "zod";
import {commitSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";
import {ListLinker} from "@/routes/admin-panel/components/ListLinker.tsx";
import EntitySelector from "@/routes/admin-panel/components/EntitySelector.tsx";

function AdminCommitPageContent(props: {
    data: ApiEntityCommitModel
}) {
    const setShowEditCommitDialog = useSetAtom($showEditCommitDialog)
    const [showEditBranchesDialog, setShowEditBranchesDialog] = useState(false)
    const [showSelectBranchForCommitJumpDialog, setShowSelectBranchForCommitJumpDialog] = useState(false)
    const navigate = useNavigate()

    const {mutate} = $api.useMutation(
        'patch',
        '/admin/commits/{commitId}'
    )
    const {mutate: mutateSetLinks} = $api.useMutation(
        'post',
        '/admin/commits/{commitId}/branches'
    )

    const onSave = useCallback(async (data: z.infer<typeof commitSchema>) => {
        mutate({
            params: {
                path: {
                    commitId: props.data.id!
                }
            },
            body: {
                hash: data.hash,
                author: data.author,
                email: data.email,
                message: data.message,
                filesChanged: data.filesChanged,
                linesAdded: data.linesAdded,
                linesRemoved: data.linesRemoved,
                createdAt: data.createdAt.toISOString()
            }
        }, {
            onSuccess() {
                toast.info('Коммит изменён')
                queryClient.invalidateQueries({queryKey: $adminCommitQueryOptions(props.data.id!).queryKey});
                setShowEditCommitDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    const onSaveLinks = useCallback(async (data: string[]) => {
        mutateSetLinks({
            params: {
                path: {
                    commitId: props.data.id!
                },
            },
            body: {
                links: data
            }
        }, {
            onSuccess() {
                toast.info('Коммит изменён')
                queryClient.invalidateQueries({queryKey: $adminCommitQueryOptions(props.data.id!).queryKey});
                setShowEditBranchesDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    return (
        <>
            {props.data?.branches?.length &&
                <EntitySelector
                    entities={props.data.branches}
                    open={showSelectBranchForCommitJumpDialog}
                    setOpen={setShowSelectBranchForCommitJumpDialog}
                    onSubmit={(branchId) => {
                        navigate(`/users/${props.data?.repository?.owner?.id}/repo/${props.data.repository?.id}/branch/${branchId}/commit/${props.data.id}`)
                    }}
                    title={"Выберите ветку"}
                />
                || false}
            <ListLinker open={showEditBranchesDialog} setOpen={setShowEditBranchesDialog}
                        initialValue={props.data.branches ?? []} onSave={onSaveLinks}/>
            <EditCommitDialog data={props.data} onSave={onSave}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.hash}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsCommits}
                    />
                    <div className={"flex flex-wrap gap-2"}>
                        <Button variant="outline" onClick={() => {
                            setShowEditCommitDialog(true)
                        }}>
                            Настройка коммита
                        </Button>
                        <Button variant={"outline"} onClick={() => {
                            setShowEditBranchesDialog(true)
                        }}>
                            Привязка веток
                        </Button>
                        <Button variant="outline" onClick={() => setShowSelectBranchForCommitJumpDialog(true)}>
                            Перейти на страницу коммита
                        </Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/users/${props.data?.repository?.owner?.id}/repo/${props.data.repository?.id}/branch/default/commit/latest`)}>
                            Перейти на страницу репозитория
                        </Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/users/${props.data?.repository?.owner?.id}`)}>
                            Перейти на страницу владельца
                        </Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/users?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'id',
                                    params: {
                                        value: props.data.repository?.owner?.id
                                    }
                                }
                            ]))
                        }>Фильтр владельца</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/repos?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'id',
                                    params: {
                                        value: props.data.repository?.id
                                    }
                                }
                            ]))
                        }>Фильтр репозиториев</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/branches?filters=` + JSON.stringify([
                                {
                                    kind: 'list_contains_string',
                                    field: 'commits',
                                    params: {
                                        value: props.data.id
                                    }
                                }
                            ]))
                        }>Фильтр веток</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/files?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'commit.id',
                                    params: {
                                        value: props.data.id
                                    }
                                }
                            ]))
                        }>Фильтр файлов</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

function AdminCommitPage() {
    const adminCommitId = useParams()['adminCommitId']
    const setSelectedAdminCommitId = useSetAtom($adminCommitId)
    const adminCommit = useAtomValue($adminCommit)

    useEffect(() => {
        setSelectedAdminCommitId(adminCommitId!)
    }, [setSelectedAdminCommitId, adminCommitId]);

    return (
        <BatchLoader states={[adminCommit]}
                     loadingMessage={"Загрузка коммита"}
                     display={() =>
                         <AdminCommitPageContent data={loaded(adminCommit).data}/>
                     }
        />
    )
}

export default AdminCommitPage;
