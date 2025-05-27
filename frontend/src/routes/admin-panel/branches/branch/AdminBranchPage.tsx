import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    $adminBranch,
    $adminBranchId, $adminBranchQueryOptions, $showEditBranchDialog,
    type ApiEntityBranchModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import EditBranchDialog from "@/components/dialogs/EditBranchDialog.tsx";
import {columnsBranches} from "@/columns/columnsBranches.tsx";
import {z} from "zod";
import {branchSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";

function AdminBranchPageContent(props: {
    data: ApiEntityBranchModel
}) {
    const showEditBranchDialog = useSetAtom($showEditBranchDialog)
    const navigate = useNavigate()

    const {mutate} = $api.useMutation(
        'patch',
        '/admin/branches/{branchId}'
    )

    const onSave = useCallback(async (data: z.infer<typeof branchSchema>) => {
        mutate({
            params: {
                path: {
                    branchId: props.data.id!
                }
            },
            body: {
                name: data.name,
                repository: data.repoId,
                createdAt: data.createdAt.toISOString(),
                isDefault: data.isDefault
            }
        }, {
            onSuccess() {
                toast.info('Ветка изменена')
                queryClient.invalidateQueries({ queryKey: $adminBranchQueryOptions(props.data.id!).queryKey });
                showEditBranchDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    return (
        <>
            <EditBranchDialog data={props.data} onSave={onSave} />
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.name}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsBranches}
                    />
                    <div className={"flex flex-wrap gap-2"}>
                        <Button variant="outline" onClick={() => {
                            showEditBranchDialog(true)
                        }}>
                            Настройка ветки
                        </Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/users/${props.data?.repository?.owner?.id}/repo/${props.data?.repository?.id}/branch/${props.data.id}/commit/latest`)}>
                            Перейти на страницу ветки
                        </Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/users/${props.data?.repository?.owner?.id}/repo/${props.data?.repository?.id}/branch/default/commit/latest`)}>
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
                                        value: props.data?.repository?.owner?.id
                                    }
                                }
                            ]))
                        }>Фильтр владельца</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/repos?filters=` + JSON.stringify([
                                {
                                    kind: 'string_equals',
                                    field: 'owner.id',
                                    params: {
                                        value: props.data.repository?.id
                                    }
                                }
                            ]))
                        }>Фильтр репозиториев</Button>
                        <Button variant="outline" onClick={() =>
                            navigate(`/admin/commits?filters=` + JSON.stringify([
                                {
                                    kind: 'list_contains_string',
                                    field: 'branches',
                                    params: {
                                        value: props.data.id
                                    }
                                }
                            ]))
                        }>Фильтр коммитов</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

function AdminBranchPage() {
    const adminBranchId = useParams()['adminBranchId']
    const setSelectedAdminBranchId = useSetAtom($adminBranchId)
    const adminBranch = useAtomValue($adminBranch)

    useEffect(() => {
        setSelectedAdminBranchId(adminBranchId!)
    }, [setSelectedAdminBranchId, adminBranchId]);

    return (
        <BatchLoader states={[adminBranch]}
                     loadingMessage={"Загрузка ветки"}
                     display={() =>
                         <AdminBranchPageContent data={loaded(adminBranch).data}/>
                     }
        />
    )
}

export default AdminBranchPage;
