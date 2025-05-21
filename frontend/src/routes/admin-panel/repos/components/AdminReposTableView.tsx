import type {ApiEntityRepositoryModel, ApiUserModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsRepos} from "@/columns/columnsRepos.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {columnsUser} from "@/columns/columnsUsers.tsx";

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
        searchFields: ["id", "username", "email", "visibility", "createdAt", "isAdmin", "repositoryCount"],
    });

    console.log(data)

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
                rowClickHandler: (user) => {
                    // navigate(`/spaces/...`)
                },
            }}
        />
    );
}

export default AdminReposTableView