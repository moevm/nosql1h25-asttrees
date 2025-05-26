import {$showEditAstTreeDialog, type ApiEntityAstTreeModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {useNavigate} from "react-router-dom";
import {columnsAstTrees, fieldsAstTrees} from "@/columns/columnsAstTrees.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useSetAtom} from "jotai/react";
import {columnsAstNodes, fieldsAstNodes} from "@/columns/columnsAstNodes.tsx";

function AdminAstNodesTableView() {
    const {
        table,
        isLoading,
        isPending,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
        filters,
        setFilters
    } = useServerTable<ApiEntityAstTreeModel>({
        columns: columnsAstNodes,
        queryUrl: "/entities/ast_nodes",
    });

    const navigate = useNavigate()

    return (
        <>
            <>
                <RichTableView
                    filters={filters}
                    setFilters={setFilters}
                    table={table}
                    isLoading={isLoading}
                    isPending={isPending}
                    data={data}
                    entityType={fieldsAstNodes}
                    queryURLname={"ast_nodes"}
                    filterString={filterString}
                    setFilterString={setFilterString}
                    searchPosition={searchPosition}
                    setSearchPosition={setSearchPosition}
                    settings={{
                        enableSearch: true,
                        enableVisualization: true,
                        enableColumnVisibilityToggle: true,
                        rowClickHandler: (astNode) => {
                            navigate(`/admin/ast-nodes/${astNode.id}`, { replace: false })
                        },
                    }}
                />
            </>
        </>
    )
}

export default AdminAstNodesTableView
