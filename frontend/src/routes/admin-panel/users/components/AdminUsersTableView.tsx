import {columnsUser, fieldsUsers} from "@/columns/columnsUsers.tsx";
import {$showEditUserDialog, type ApiUserModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useSetAtom} from "jotai/react";

function AdminUsersTableView() {
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
    } = useServerTable<ApiUserModel>({
        columns: columnsUser,
        queryUrl: "/entities/users",
    });
    const navigate = useNavigate()
    const setShowEditUserDialog = useSetAtom($showEditUserDialog)

    return (
        <RichTableView
            filters={filters}
            setFilters={setFilters}
            table={table}
            entityType={fieldsUsers}
            queryURLname={"users"}
            isLoading={isLoading}
            isPending={isPending}
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
            // buttonsSlot={() => (
            //     <Button size="sm" onClick={() => {setShowEditUserDialog(true)}}>
            //         Создать пользователя
            //     </Button>
            // )}
        />
    );
}

export default AdminUsersTableView
