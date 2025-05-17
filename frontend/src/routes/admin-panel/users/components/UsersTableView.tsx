import {columnsUser} from "@/columns/columnsUsers.tsx";
import {useNavigate} from "react-router-dom";
import type {ApiUserModel} from "@/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";

function UserTableView(props: {
    data: ApiUserModel[]
}) {
    console.log(props.data);
    const navigate = useNavigate();
    return (
        <>
            <RichTableView
                entries={props.data}
                tableConfig={{
                    columns: columnsUser
                }}
                settings={{
                    enableSearch: true,
                    enableExport: true,
                    enableImport: true,
                    // enableSelectFromFile: true,
                    enableColumnVisibilityToggle: true,
                    rowClickHandler: (user) => {
                        // navigate(`/spaces/${selectedSpaceId}/dashboard/users/${user._id}`)
                    }
                }}
            />
        </>
    )
}

export default UserTableView