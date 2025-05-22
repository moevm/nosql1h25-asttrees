import {$showEditRepoDialog, type ApiEntityRepositoryModel} from "@/store/store.ts";
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsRepos, fieldsRepos} from "@/columns/columnsRepos.tsx";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useSetAtom} from "jotai/react";

function AdminReposTableView() {
    const {
        table,
        isLoading,
        isPending,
        filterString,
        setFilterString,
        searchPosition,
        data,
        setSearchPosition,
    } = useServerTable<ApiEntityRepositoryModel>({
        columns: columnsRepos,
        queryUrl: "/entities/repositories",
    });

    const navigate = useNavigate()
    const setShowEditRepoDialog = useSetAtom($showEditRepoDialog)

    return (
        <RichTableView
            table={table}
            isLoading={isLoading}
            isPending={isPending}
            entityType={fieldsRepos}
            queryURLname={"repositories"}
            data={data}
            filterString={filterString}
            setFilterString={setFilterString}
            searchPosition={searchPosition}
            setSearchPosition={setSearchPosition}
            settings={{
                enableSearch: true,
                enableVisualization: true,
                enableColumnVisibilityToggle: true,
                rowClickHandler: (repo) => {
                    navigate(`/admin/repos/${repo.id}`, { replace: false })
                },
            }}
            buttonsSlot={() => (
                <Button size="sm" onClick={() => {setShowEditRepoDialog(true)}}>
                    Создать репозиторий
                </Button>
            )}
        />
    );
}

export default AdminReposTableView
