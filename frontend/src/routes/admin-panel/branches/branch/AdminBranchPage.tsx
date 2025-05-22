import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    CheckboxRenderer,
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminBranch,
    $adminBranchId, $showEditBranchDialog,
    type ApiEntityBranchModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {loaded} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {typesVisibilityType} from "@/lib/table.ts";
import EditBranchDialog from "@/components/dialogs/EditBranchDialog.tsx";

function AdminBranchPageContent(props: {
    data: ApiEntityBranchModel
}) {
    const showEditBranchDialog = useSetAtom($showEditBranchDialog)
    return (
        <>
            <EditBranchDialog/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.name}</Label>

                    <EntityCard
                        items={[
                            ['id', <MonoRenderer value={props.data.id}/>],
                            ['Название', props.data.name],
                            ['Название репозитория', props.data.repository?.name],
                            ['Владелец репозитория', props.data.repository?.owner?.username],
                            ['Источник репозитория', props.data.repository?.originalLink],
                            ['Публичность репозитория', typesVisibilityType[props.data.repository?.visibility]],
                            ['Дата создания репозитория',
                                <DateRenderer value={dayjs(props.data.repository?.createdAt)}/>],
                            ['Основная ветка', <CheckboxRenderer value={props.data.isDefault}/>],
                            ['Дата создания', <DateRenderer value={dayjs(props.data.createdAt)}/>],
                            ['Количество коммитов', props.data.commitCount],
                        ]}
                    />
                    <div className={"flex justify-between gap-6"}>
                        <div className="flex justify-between gap-2">
                            <Button variant="outline" onClick={() => {
                                showEditBranchDialog(true)
                            }}>
                                Настройка ветки
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
