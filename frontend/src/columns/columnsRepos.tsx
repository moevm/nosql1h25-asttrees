import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utlis/ValueRenderers.tsx";
import type {ApiEntityRepositoryModel} from "@/store/store.ts";
import type {TypedColumnDef} from "@/columns/columnsUsers.tsx";
import dayjs from "dayjs";

const typesVisibilityType = {
    'PUBLIC': "Публичный",
    'PROTECTED': "Защищенный",
    'PRIVATE': "Приватный"
}

export const columnsRepos = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Выбрать всё"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                className="row-select-checkbox"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Выбрать"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
            type: 'none'
        }
    },
    {
        accessorKey: "id",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="id"/>
            )
        },
        meta: {
            title: "id",
            type: 'string',
        },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "name",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Название"/>
            )
        },
        meta: {
            title: "Название",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "owner_username",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Владелец"/>
            );
        },
        meta: {
            title: "Владелец",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "originalLink",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Источник"/>
            )
        },
        meta: {
            title: "Источник",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "visibility",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Публичность"/>
            )
        },
        meta: {
            title: "Публичность",
            type: 'string'
        },
        accessorFn: (row) => {
            return typesVisibilityType[row.visibility] ?? row.visibility
        },
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Дата создания"/>
            )
        },
        accessorFn: (row) => {
            return dayjs(row.createdAt);
        },
        meta: {
            title: "Дата создания",
            type: 'datetime',
        },
        cell: ({ cell }) => <DateRenderer value={cell.getValue()} />,
    },
    {
        accessorKey: "branchCount",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Количество веток"/>
            )
        },
        meta: {
            title: "Количество веток",
            type: 'number',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "commitCount",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Количество коммитов"/>
            )
        },
        meta: {
            title: "Количество коммитов",
            type: 'number',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<ApiEntityRepositoryModel>[]