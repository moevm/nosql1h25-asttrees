import type {ApiEntityAstTreeModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {useNavigate} from "react-router-dom";
import {columnsAstTrees} from "@/columns/columnsAstTrees.tsx";

function AdminAstTreesTableView() {
    const {
        table,
        isLoading,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
    } = useServerTable<ApiEntityAstTreeModel>({
        columns: columnsAstTrees,
        queryUrl: "/entities/ast_trees",
        searchFields: ["id", "username", "email", "visibility", "createdAt", "isAdmin", "repositoryCount"],
    });

    const navigate = useNavigate()

    return (
        <>
            <>
                <RichTableView
                    table={table}
                    isLoading={isLoading}
                    data={data}
                    filterString={filterString}
                    setFilterString={setFilterString}
                    searchPosition={searchPosition}
                    setSearchPosition={setSearchPosition}
                    settings={{
                        enableSearch: true,
                        enableVisualization: true,
                        enableColumnVisibilityToggle: true,
                        rowClickHandler: (astTree) => {
                            navigate(`/admin/ast-trees/${astTree.id}`)
                        },
                    }}
                />
            </>
        </>
    )
}

export default AdminAstTreesTableView