import type {ApiEntityRepositoryModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsRepos} from "@/columns/columnsRepos.tsx";

function ReposTableView(props: {
    data: ApiEntityRepositoryModel[]
}) {
    return (
        <>
            <>
                <RichTableView
                    entries={props.data}
                    tableConfig={{
                        columns: columnsRepos
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

export default ReposTableView