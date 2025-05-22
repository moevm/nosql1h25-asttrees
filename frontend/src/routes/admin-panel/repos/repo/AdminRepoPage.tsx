import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminRepo,
    $adminRepoId, $showEditRepoDialog, type ApiEntityRepositoryModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {loaded} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {typesVisibilityType} from "@/lib/table.ts";
import EditRepoDialog from "@/components/dialogs/EditRepoDialog.tsx";

function AdminRepoPageContent(props: {
    data: ApiEntityRepositoryModel
}) {
    const setShowEditRepoDialog = useSetAtom($showEditRepoDialog)
    return (
        <>
            <EditRepoDialog data={props.data}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.name}</Label>

                    <EntityCard
                        items={[
                            ['id', <MonoRenderer value={props.data.id}/>],
                            ['Название', props.data.name],
                            ['Владелец', props.data.owner?.username],
                            ['Публичность', typesVisibilityType[props.data.visibility]],
                            ['Источник', props.data.originalLink],
                            ['Дата создания', <DateRenderer value={dayjs(props.data.createdAt)}/>],
                            ['Количество веток', props.data.branchCount],
                            ['Количество коммитов', props.data.commitCount],
                        ]}
                    />
                    <div className={"flex justify-between gap-6"}>
                        <div className="flex justify-between gap-2">
                            <Button variant="outline" onClick={() => {
                                setShowEditRepoDialog(true)
                            }}>
                                Настройка репозитория
                            </Button>
                        </div>
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
