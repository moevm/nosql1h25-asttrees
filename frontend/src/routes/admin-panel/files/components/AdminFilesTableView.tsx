
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsFiles, fieldsFiles} from "@/columns/columnsFiles.tsx";
import { faker } from "@faker-js/faker";
import {useServerTable} from "@/hooks/useServerTable.tsx";
import type {ApiEntityCommitFileModel, ApiEntityCommitModel} from "@/store/store.ts";
import {columnsCommits, fieldsCommits} from "@/columns/columnsCommits.tsx";
import {useNavigate} from "react-router-dom";

function AdminFilesTableView() {
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
    } = useServerTable<ApiEntityCommitFileModel>({
        columns: columnsFiles,
        queryUrl: "/entities/commit_files",
    });

    const navigate = useNavigate()

    return (
        <RichTableView
            filters={filters}
            setFilters={setFilters}
            table={table}
            isLoading={isLoading}
            isPending={isPending}
            entityType={fieldsFiles}
            queryURLname={"commit_files"}
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
                    navigate(`/admin/files/${commit.id}`, { replace: false })
                },
            }}
        />
    );
}

export default AdminFilesTableView
