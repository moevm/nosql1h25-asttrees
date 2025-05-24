import {$showEditCommitDialog, type ApiEntityCommitModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsCommits, fieldsCommits} from "@/columns/columnsCommits.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useSetAtom} from "jotai/react";

function AdminCommitsTableView() {
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
    } = useServerTable<ApiEntityCommitModel>({
        columns: columnsCommits,
        queryUrl: "/entities/commits",
    });

    const navigate = useNavigate()
    const setShowEditCommitDialog = useSetAtom($showEditCommitDialog)

    return (
        <RichTableView
            filters={filters}
            setFilters={setFilters}
            table={table}
            isLoading={isLoading}
            isPending={isPending}
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
                    navigate(`/admin/commits/${commit.id}`, { replace: false })
                },
            }}
            // buttonsSlot={() => (
            //     <Button size="sm" onClick={() => {setShowEditCommitDialog(true)}}>
            //         Создать коммит
            //     </Button>
            // )}
        />
    );
}

export default AdminCommitsTableView
