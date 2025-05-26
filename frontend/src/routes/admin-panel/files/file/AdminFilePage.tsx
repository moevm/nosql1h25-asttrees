import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    $adminCommitFile, $adminCommitFileQueryOptions,
    $adminFileId, $adminUserQueryOptions, $currentUserReposQueryOptions,
    $showEditFileDialog, type ApiEntityCommitFileModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import {useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useCallback, useEffect} from "react";
import {$api, defaultOnErrorHandler, loaded, queryClient} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";
import {columnsFiles} from "@/columns/columnsFiles.tsx";
import EditCommitFileDialog from "@/components/dialogs/EditCommitFileDialog.tsx";
import {z} from "zod";
import {commitFileSchema, type userSchema} from "@/lib/formSchemas.ts";
import {toast} from "sonner";

function AdminFilePageContent(props: {
    data: ApiEntityCommitFileModel
}) {
    const setShowEditCommitFileDialog = useSetAtom($showEditFileDialog)
    const navigate = useNavigate()


    const {mutate} = $api.useMutation(
        'patch',
        '/admin/commit_files/{commitFileId}'
    )

    const onSave = useCallback(async (data: z.infer<typeof commitFileSchema>) => {
        mutate({
            params: {
                path: {
                    commitFileId: props.data.id!
                }
            },
            body: {
               name: data.name,
                fullPath: data.fullPath,
                // type: data.type,
                hash: data.hash || undefined,
                parent: data.parent || undefined,
                commit: data.commit
            }
        }, {
            onSuccess() {
                toast.info('Файл изменён')
                queryClient.invalidateQueries({ queryKey: $adminCommitFileQueryOptions(props.data.id!).queryKey });
                setShowEditCommitFileDialog(false)
            },
            onError: defaultOnErrorHandler
        })
    }, [])


    return (
        <>
            <EditCommitFileDialog data={props.data} onSave={onSave}/>
            {/*<EditRepoDialog data={props.data}/>*/}
            <div className="flex flex-col py-6 mx-6">
                <div className="flex flex-col gap-2">
                    <Label className={"text-3xl"}>{props.data.id}</Label>

                    <EntityCard
                        entity={props.data}
                        columns={columnsFiles}
                    />
                    <div className={"flex justify-between gap-6"}>
                        <div className="flex justify-between gap-2">
                            <Button variant="outline" onClick={() => {
                                setShowEditCommitFileDialog(true)
                            }}>
                                Настройка файла
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function AdminFilePage() {
    const adminFileId = useParams()['adminFileId']
    const setSelectedAdminFileId = useSetAtom($adminFileId)
    const adminFile = useAtomValue($adminCommitFile)

    useEffect(() => {
        setSelectedAdminFileId(adminFileId!)
    }, [setSelectedAdminFileId, adminFileId]);

    return (
        <BatchLoader states={[adminFile]}
                     loadingMessage={"Загрузка файла"}
                     display={() =>
                         <AdminFilePageContent data={loaded(adminFile).data}/>
                     }
        />
    )
}

export default AdminFilePage;
