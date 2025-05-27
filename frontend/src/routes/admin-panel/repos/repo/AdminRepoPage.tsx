import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    $adminRepo,
    $adminRepoId, $adminRepoQueryOptions, $showEditRepoDialog, type ApiEntityRepositoryModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import EditRepoDialog from "@/components/dialogs/EditRepoDialog.tsx";
import {columnsRepos} from "@/columns/columnsRepos.tsx";
import {z} from "zod";
import {repoSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";

function AdminRepoPageContent(props: {
    data: ApiEntityRepositoryModel
}) {
    const setShowEditRepoDialog = useSetAtom($showEditRepoDialog)
    const navigate = useNavigate()

    const {mutate} = $api.useMutation(
        'patch',
        '/admin/repositories/{repositoryId}'
    )

    const onSave = useCallback(async (data: z.infer<typeof repoSchema>) => {
        mutate({
            params: {
                path: {
                    repositoryId: props.data.id!
                }
            },
            body: {
                name: data.name,
                owner: data.ownerId,
                visibility: data.visibility,
                createdAt: data.createdAt.toISOString(),
                originalLink: data.originalLink
            }
        }, {
            onSuccess() {
                toast.info('Репозиторий изменён')
                queryClient.invalidateQueries({queryKey: $adminRepoQueryOptions(props.data.id!).queryKey});
                setShowEditRepoDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    return (
        <>
            <EditRepoDialog data={props.data} onSave={onSave}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.name}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsRepos}
                    />
                    <div className={"flex flex-wrap gap-2"}>
                        <Button variant="outline" onClick={() => {
                            setShowEditRepoDialog(true)
                        }}>
                            Настройка репозитория
                        </Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/users/${props.data?.owner?.id}/repo/${props.data.id}/branch/default/commit/latest`)}>
                            Перейти на страницу репозитория
                        </Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/users/${props.data?.owner?.id}`)
                        }>Перейти на страницу владельца</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/users?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'id',
                                    params: {
                                        value: props.data.owner.id
                                    }
                                }
                            ]))
                        }>Фильтр владельца</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/branches?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'repository.id',
                                    params: {
                                        value: props.data.id
                                    }
                                }
                            ]))
                        }>Фильтр веток</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/commits?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'repository.id',
                                    params: {
                                        value: props.data.id
                                    }
                                }
                            ]))
                        }>Фильтр коммитов</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/files?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'repository.id',
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

function AdminRepoPage() {
    const adminRepoId = useParams()['adminRepoId']
    const setSelectedAdminRepoId = useSetAtom($adminRepoId)
    const adminRepo = useAtomValue($adminRepo)

    useEffect(() => {
        setSelectedAdminRepoId(adminRepoId!)
    }, [setSelectedAdminRepoId, adminRepoId]);

    return (
        <BatchLoader states={[adminRepo]}
                     loadingMessage={"Загрузка репозитория"}
                     display={() =>
                         <AdminRepoPageContent data={loaded(adminRepo).data}/>
                     }
        />
    )
}

export default AdminRepoPage;
