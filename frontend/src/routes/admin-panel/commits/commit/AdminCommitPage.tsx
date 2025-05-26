import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminCommit, $adminCommitId, $adminCommitQueryOptions, $adminUserQueryOptions, $showEditCommitDialog,
    type ApiEntityCommitModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {typesVisibilityType} from "@/lib/table.ts";
import EditCommitDialog from "@/components/dialogs/EditCommitDialog.tsx";
import {columnsCommits} from "@/columns/columnsCommits.tsx";
import {z} from "zod";
import {commitSchema, getInitialDate, type userSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";

function AdminCommitPageContent(props: {
    data: ApiEntityCommitModel
}) {
    const setShowEditCommitDialog = useSetAtom($showEditCommitDialog)

    const {mutate} = $api.useMutation(
        'patch',
        '/admin/commits/{commitId}'
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
                queryClient.invalidateQueries({ queryKey: $adminCommitQueryOptions(props.data.id!).queryKey });
                setShowEditCommitDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])

    return (
        <>
            <EditCommitDialog data={props.data} onSave={onSave}/>
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.hash}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsCommits}
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
