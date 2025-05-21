import type {ApiEntityBranchModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {columnsBranches} from "@/columns/columnsBranches.tsx";
import {useNavigate} from "react-router-dom";

function AdminBranchesTableView() {
    const {
        table,
        isLoading,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
    } = useServerTable<ApiEntityBranchModel>({
        columns: columnsBranches,
        queryUrl: "/entities/branches",
        searchFields: ["id", "username", "email", "visibility", "createdAt", "isAdmin", "repositoryCount"],
    });

    const navigate = useNavigate()

    return (
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
                rowClickHandler: (branch) => {
                    navigate(`/admin/branches/${branch.id}`)
                },
            }}
        />
    );
}

export default AdminBranchesTableView