import {columnsUser, fieldsUsers} from "@/columns/columnsUsers.tsx";
import type {ApiUserModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {useNavigate} from "react-router-dom";

function AdminUsersTableView() {
    const {
        table,
        isLoading,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
    } = useServerTable<ApiUserModel>({
        columns: columnsUser,
        queryUrl: "/entities/users",
    });
    const navigate = useNavigate()

    return (
        <RichTableView
            table={table}
            entityType={fieldsUsers}
            queryURLname={"users"}
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
                    navigate(`/admin/users/${user.id}`, { replace: false })
                },
            }}
        />
    );
}

export default AdminUsersTableView
