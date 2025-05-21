import {columnsUser} from "@/columns/columnsUsers.tsx";
import type {ApiUserModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";

function AdminUsersTableView() {
    const {
        table,
        isLoading,
        filterString,
        setFilterString,
        searchPosition,
        setSearchPosition,
    } = useServerTable<ApiUserModel>({
        columns: columnsUser,
        queryUrl: "/entities/users",
        searchFields: ["id", "username", "email", "visibility", "createdAt", "isAdmin", "repositoryCount"],
    });


    return (
        <RichTableView
            table={table}
            isLoading={isLoading}
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

export default AdminUsersTableView;