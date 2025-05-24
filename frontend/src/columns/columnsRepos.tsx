import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import type {ApiEntityRepositoryModel} from "@/store/store.ts";
import dayjs from "dayjs";
import {type TypedColumnDef, typesVisibilityType} from "@/lib/table.ts";
import type {EntityField} from "@/lib/utils.ts";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";

export const fieldsRepos: EntityField[] = [
    {
        id: "id",
        name: "ID",
        type: "string"
    },
    {
        id: "name",
        name: "Название",
        type: "string"
    },
    {
        id: "owner.id",
        name: "ID владельца",
        type: "string"
    },
    {
        id: "owner.username",
        name: "Никнейм владельца",
        type: "string"
    },
    {
        id: "originalLink",
        name: "Источник",
        type: "string"
    },
    {
        id: "visibility",
        name: "Публичность",
        type: "string"
    },
    {
        id: "createdAt",
        name: "Дата создания",
        type: "date"
    },
    {
        id: "branchCount",
        name: "Количество веток",
        type: "int"
    },
    {
        id: "commitCount",
        name: "Количество коммитов",
        type: "int"
    }
]

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
            field: "id"
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
            field: 'name'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "owner.username",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Владелец"/>
            );
        },
        meta: {
            title: "Владелец",
            type: 'string',
            field: 'owner.username'
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
            field: 'originalLink'
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
            type: 'string',
            field: 'visibility'
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
            field: 'createdAt'
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
            field: 'branchCount'
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
            field: 'commitCount'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<ApiEntityRepositoryModel>[]
