import type {ApiEntityRepositoryModel, ApiUserModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsRepos} from "@/columns/columnsRepos.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {columnsUser} from "@/columns/columnsUsers.tsx";
import {useNavigate} from "react-router-dom";

function AdminReposTableView() {
    const {
        table,
        isLoading,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
    } = useServerTable<ApiEntityRepositoryModel>({
        columns: columnsRepos,
        queryUrl: "/entities/repositories",
        searchFields: ["id", "name", "owner", "originalLink", "visibility", "createdAt", "branchCount", "commitCount"],
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
                rowClickHandler: (repo) => {
                    navigate(`/admin/repos/${repo.id}`, { replace: true })
                },
            }}
        />
    );
}

export default AdminReposTableView
