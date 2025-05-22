import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminCommit, $adminCommitId, $showEditCommitDialog,
    type ApiEntityCommitModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {loaded} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {typesVisibilityType} from "@/lib/table.ts";
import EditCommitDialog from "@/components/dialogs/EditCommitDialog.tsx";

function AdminCommitPageContent(props: {
    data: ApiEntityCommitModel
}) {
    const setShowEditCommitDialog = useSetAtom($showEditCommitDialog)
    return (
        <>
            <EditCommitDialog data={props.data}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.hash}</Label>

                    <EntityCard
                        items={[
                            ['id', <MonoRenderer value={props.data.id}/>],
                            ['Hash', props.data.hash],
                            ['Автор', props.data.author],
                            ['Email', props.data.email],
                            ['Сообщение', props.data.message],
                            ['Файлов изменено', props.data.filesChanged],
                            ['Строк изменено', `+${props.data.linesAdded}/-${props.data.linesRemoved}`],
                            ['Название репозитория', props.data.repository?.name],
                            ['Владелец репозитория', props.data.repository?.owner?.username],
                            ['Источник репозитория', props.data.repository?.originalLink],
                            ['Публичность репозитория', typesVisibilityType[props.data.repository?.visibility]],
                            ['Дата создания репозитория',
                                <DateRenderer value={dayjs(props.data.repository?.createdAt)}/>],
                            ['Количество веток', props.data.branchCount],
                            ['Количество файлов', props.data.fileCount],
                            ['Количество файлов с AST', props.data.fileWithAstCount],
                            ['Дата создания', <DateRenderer value={dayjs(props.data.createdAt)}/>],
                        ]}
                    />
                    <div className={"flex justify-between gap-6"}>
                        <div className="flex justify-between gap-2">
                            <Button variant="outline" onClick={() => {
                                setShowEditCommitDialog(true)
                            }}>
                                Настройка коммита
                            </Button>
                        </div>
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
