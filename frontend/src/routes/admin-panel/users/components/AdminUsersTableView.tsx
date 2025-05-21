import {columnsUser} from "@/columns/columnsUsers.tsx";
import type {ApiUserModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";

function AdminUsersTableView(props: {
    data: ApiUserModel[]
}) {
    return (
        <>
            <RichTableView
                entries={props.data}
                tableConfig={{
                    columns: columnsUser
                }}
                settings={{
                    enableSearch: true,
                    enableVisualization: true,
                    enableColumnVisibilityToggle: true,
                    rowClickHandler: (user) => {
                        // navigate(`/spaces/${selectedSpaceId}/dashboard/users/${user._id}`)
                    }
                }}
            />
        </>
    )
}

export default AdminUsersTableView