import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    CheckboxRenderer,
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminUser,
    $adminUserId,
    $showEditUserDialog,
    type ApiEntityUserModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {loaded} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {typesVisibilityType} from "@/lib/table.ts";
import EditUserDialog from "@/components/dialogs/EditUserDialog.tsx";

function AdminUserPageContent(props: {
    data: ApiEntityUserModel
}) {
    const navigate = useNavigate()
    const setShowEditUserDialog = useSetAtom($showEditUserDialog)
    return (
        <>
            <EditUserDialog data={props.data}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.username}</Label>

                    <EntityCard
                        items={[
                            ['id', <MonoRenderer value={props.data.id}/>],
                            ['Никнейм', props.data.username],
                            ['Email', props.data.email],
                            ['Публичность', typesVisibilityType[props.data.visibility]],
                            ['Дата создания', <DateRenderer value={dayjs(props.data.createdAt)}/>],
                            ['Админ', <CheckboxRenderer value={props.data.isAdmin}/>],
                            ['Количество репозиториев', props.data.repositoryCount],
                        ]}
                    />
                    <div className={"flex justify-between gap-6"}>
                        <div className="flex justify-between gap-2">
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
