import type {ApiEntityRepositoryModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsCommits} from "@/columns/columnsCommits.tsx";

function CommitsAdminTableView(props: {
    data: ApiEntityRepositoryModel[]
}) {
    return (
        <>
            <>
                <RichTableView
                    entries={props.data}
                    tableConfig={{
                        columns: columnsCommits
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
        </>
    )
}

export default CommitsAdminTableView