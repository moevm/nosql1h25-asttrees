import type {ApiEntityCommitModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsCommits, fieldsCommits} from "@/columns/columnsCommits.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {useNavigate} from "react-router-dom";

function AdminCommitsTableView() {
    const {
        table,
        isLoading,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
    } = useServerTable<ApiEntityCommitModel>({
        columns: columnsCommits,
        queryUrl: "/entities/commits",
        searchFields: ["id", "username", "email", "visibility", "createdAt", "isAdmin", "repositoryCount"],
    });

    const navigate = useNavigate()

    return (
        <RichTableView
            table={table}
            isLoading={isLoading}
            entityType={fieldsCommits}
            queryURLname={"commits"}
            data={data}
            filterString={filterString}
            setFilterString={setFilterString}
            searchPosition={searchPosition}
            setSearchPosition={setSearchPosition}
            settings={{
                enableSearch: true,
                enableVisualization: true,
                enableColumnVisibilityToggle: true,
                rowClickHandler: (commit) => {
                    navigate(`/admin/commits/${commit.id}`)
                },
            }}
        />
    );
}

export default AdminCommitsTableView