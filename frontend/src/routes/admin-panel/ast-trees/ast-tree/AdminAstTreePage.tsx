import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DateRenderer,
    MonoRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import {
    $adminAstTree,
    $adminAstTreeId,
    type ApiEntityAstTreeModel
} from "@/store/store.ts";
import EntityCard from "@/components/custom/EntityCard.tsx"
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai/react";
import {useEffect} from "react";
import {loaded} from "@/api";
import {BatchLoader} from "@/components/custom/BatchLoader/BatchLoader.tsx";

function AdminAstTreePageContent(props: {
    data: ApiEntityAstTreeModel
}) {
    return (
        <div className="flex flex-col py-6 mx-6">
            <div className="flex flex-col gap-2">
                <Label className={"text-3xl"}>{props.data.commitFile?.name}</Label>

                <EntityCard
                    items={[
                        ['id', <MonoRenderer value={props.data.id}/>],
                        ['Дата создания', <DateRenderer value={dayjs(props.data.createdAt)}/>],
                        ['Глубина', props.data.depth],
                        ['Размер', props.data.size],
                        ['Название файла', props.data.commitFile?.name],
                        ['Hash файла', props.data.commitFile?.hash],
                    ]}
                />
                <div className={"flex justify-between gap-6"}>
                    <div className="flex justify-between gap-2">
                        <Button variant="outline">
                            Настройка AST-дерева
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AdminAstTreePage() {
    const adminAstTreeId = useParams()['adminAstTreeId']
    const setSelectedAdminAstTreeId = useSetAtom($adminAstTreeId)
    const adminAstTree = useAtomValue($adminAstTree)

    useEffect(() => {
        setSelectedAdminAstTreeId(adminAstTreeId!)
    }, [setSelectedAdminAstTreeId, adminAstTreeId]);

    return (
        <BatchLoader states={[adminAstTree]}
                     loadingMessage={"Загрузка AST-дерева"}
                     display={() =>
                         <AdminAstTreePageContent data={loaded(adminAstTree).data}/>
                     }
        />
    )
}

export default AdminAstTreePage;
