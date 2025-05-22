import {$showEditBranchDialog, type ApiEntityBranchModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {columnsBranches, fieldsBranches} from "@/columns/columnsBranches.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useSetAtom} from "jotai/react";

function AdminBranchesTableView() {
    const {
        table,
        isLoading,
        isPending,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
    } = useServerTable<ApiEntityBranchModel>({
        columns: columnsBranches,
        queryUrl: "/entities/branches",
    });

    const navigate = useNavigate()
    const setShowEditBranchDialog = useSetAtom($showEditBranchDialog)

    return (
        <RichTableView
            table={table}
            isLoading={isLoading}
            isPending={isPending}
            entityType={fieldsBranches}
            queryURLname={"branches"}
            data={data}
            filterString={filterString}
            setFilterString={setFilterString}
            searchPosition={searchPosition}
            setSearchPosition={setSearchPosition}
            settings={{
                enableSearch: true,
                enableVisualization: true,
                enableColumnVisibilityToggle: true,
                rowClickHandler: (branch) => {
                    navigate(`/admin/branches/${branch.id}`, { replace: false })
                },
            }}
            buttonsSlot={() => (
                <Button size="sm" onClick={() => {setShowEditBranchDialog(true)}}>
                    Создать ветеку
                </Button>
            )}
        />
    );
}

export default AdminBranchesTableView
