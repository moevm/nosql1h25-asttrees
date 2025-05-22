import {$showEditAstTreeDialog, type ApiEntityAstTreeModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {useNavigate} from "react-router-dom";
import {columnsAstTrees, fieldsAstTrees} from "@/columns/columnsAstTrees.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useSetAtom} from "jotai/react";

function AdminAstTreesTableView() {
    const {
        table,
        isLoading,
        isPending,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
    } = useServerTable<ApiEntityAstTreeModel>({
        columns: columnsAstTrees,
        queryUrl: "/entities/ast_trees",
    });

    const navigate = useNavigate()
    const setShowEditAstTreeDialog = useSetAtom($showEditAstTreeDialog)

    return (
        <>
            <>
                <RichTableView
                    table={table}
                    isLoading={isLoading}
                    isPending={isPending}
                    data={data}
                    entityType={fieldsAstTrees}
                    queryURLname={"ast_trees"}
                    filterString={filterString}
                    setFilterString={setFilterString}
                    searchPosition={searchPosition}
                    setSearchPosition={setSearchPosition}
                    settings={{
                        enableSearch: true,
                        enableVisualization: true,
                        enableColumnVisibilityToggle: true,
                        rowClickHandler: (astTree) => {
                            navigate(`/admin/ast-trees/${astTree.id}`, { replace: false })
                        },
                    }}
                    buttonsSlot={() => (
                        <Button size="sm" onClick={() => {setShowEditAstTreeDialog(true)}}>
                            Создать AST-дерево
                        </Button>
                    )}
                />
            </>
        </>
    )
}

export default AdminAstTreesTableView
