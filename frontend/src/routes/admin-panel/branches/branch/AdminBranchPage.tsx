import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    CheckboxRenderer,
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminBranch,
    $adminBranchId, $adminBranchQueryOptions, $adminUserQueryOptions, $showEditBranchDialog,
    type ApiEntityBranchModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {typesVisibilityType} from "@/lib/table.ts";
import EditBranchDialog from "@/components/dialogs/EditBranchDialog.tsx";
import {columnsBranches} from "@/columns/columnsBranches.tsx";
import {z} from "zod";
import {branchSchema, type userSchema} from "@/lib/formSchemas.ts";
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
                    <div className={"flex justify-between gap-6"}>
                        <div className="flex justify-between gap-2">
                            <Button variant="outline" onClick={() => {
                                showEditBranchDialog(true)
                            }}>
                                Настройка ветки
                            </Button>
                            <Button variant="outline" onClick={() =>
                                navigate(`/users/${props.data.repository.owner.id}/repo/${props.data.repository.id}/branch/${props.data.id}/commit/latest`)}>
                                Просмотр
                            </Button>

                        </div>
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
