import type {ApiEntityRepositoryModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsRepos, fieldsRepos} from "@/columns/columnsRepos.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
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
    });

    const navigate = useNavigate()

    return (
        <RichTableView
            table={table}
            isLoading={isLoading}
            entityType={fieldsRepos}
            queryURLname={"repositories"}
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
                    navigate(`/admin/repos/${repo.id}`, { replace: false })
                },
            }}
        />
    );
}

export default AdminReposTableView
