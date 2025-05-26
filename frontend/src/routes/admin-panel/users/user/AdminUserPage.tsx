import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    CheckboxRenderer,
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminUser,
    $adminUserId, $adminUserQueryOptions,
    $showEditUserDialog,
    type ApiEntityUserModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {typesVisibilityType} from "@/lib/table.ts";
import EditUserDialog from "@/components/dialogs/EditUserDialog.tsx";
import {columnsUser} from "@/columns/columnsUsers.tsx";
import {z} from "zod";
import type {userSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";

function AdminUserPageContent(props: {
    data: ApiEntityUserModel
}) {
    const navigate = useNavigate()
    const setShowEditUserDialog = useSetAtom($showEditUserDialog)

    const {mutate} = $api.useMutation(
        'patch',
        '/admin/users/{userId}'
    )

    const onSave = useCallback(async (data: z.infer<typeof userSchema>) => {
        mutate({
            params: {
                path: {
                    userId: props.data.id!
                }
            },
            body: {
                username: data.username,
                email: data.email,
                visibility: data.visibility,
                createdAt: data.createdAt.toISOString(),
                isAdmin: data.isAdmin,
            }
        }, {
            onSuccess() {
                toast.info('Пользователь изменён')
                queryClient.invalidateQueries({ queryKey: $adminUserQueryOptions(props.data.id!).queryKey });
                setShowEditUserDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    return (
        <>
            <EditUserDialog data={props.data} onSave={onSave}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.username}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsUser}
                    />
                    <div className={"flex justify-between gap-6"}>
                        <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" onClick={() => {
                                setShowEditUserDialog(true)
                            }}>
                                Настройка пользователя
                            </Button>
                            <Button variant="outline" onClick={() => navigate(`/users/${props.data.id}`)}>Перейти на страницу</Button>
                            <Button variant="outline" onClick={() =>
                                navigate(`/admin/repos?filters=` + JSON.stringify([
                                    {
                                        kind: 'string_equals',
                                        field: 'owner.id',
                                        params: {
                                            value: props.data.id
                                        }
                                    }
                                ]))
                            }>Фильтр репозиториев</Button>
                            <Button variant="outline" onClick={() =>
                                navigate(`/admin/branches?filters=` + JSON.stringify([
                                    {
                                        kind: 'string_equals',
                                        field: 'repository.owner.id',
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
                                        field: 'repository.owner.id',
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
                                        field: 'repository.owner',
                                        params: {
                                            value: props.data.id
                                        }
                                    }
                                ]))
                            }>Фильтр файлов</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function AdminUserPage() {
    const adminUserId = useParams()['adminUserId']
    const setSelectedAdminUserId = useSetAtom($adminUserId)
    const adminUser = useAtomValue($adminUser)

    useEffect(() => {
        setSelectedAdminUserId(adminUserId!)
    }, [setSelectedAdminUserId, adminUserId]);

    return (
        <BatchLoader states={[adminUser]}
                     loadingMessage={"Загрузка пользователя"}
                     display={() =>
                         <AdminUserPageContent data={loaded(adminUser).data}/>
                     }
        />
    )
}

export default AdminUserPage;
