import type {ApiEntityBranchModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsBranches} from "@/columns/columnsBranches.tsx";

function AdminBranchesTableView(props: {
    data: ApiEntityBranchModel[]
}) {
    return (
        <>
            <>
                <RichTableView
                    entries={props.data}
                    tableConfig={{
                        columns: columnsBranches
                    }}
                    settings={{
                        enableSearch: true,
                        enableVisualization: true,
                        enableColumnVisibilityToggle: true,
                        rowClickHandler: () => {
                            // navigate(`/spaces/${selectedSpaceId}/dashboard/users/${user._id}`)
                        }
                    }}
                />
            </>
        </>
    )
}

export default AdminBranchesTableView