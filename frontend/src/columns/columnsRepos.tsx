import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import type {ApiEntityRepositoryModel} from "@/store/store.ts";
import dayjs from "dayjs";
import {type TypedColumnDef, typesVisibilityType} from "@/lib/table.ts";
import type {EntityField} from "@/lib/utils.ts";
import {DateRenderer, EntityIdRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";

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
        header: DataTableColumnHeader,
        meta: {
            title: "id",
            type: 'string',
            field: "id"
        },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "name",
        header: DataTableColumnHeader,
        meta: {
            title: "Название",
            type: 'string',
            field: 'name'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "owner.username",
        header: DataTableColumnHeader,
        meta: {
            title: "Никнейм владельца",
            type: 'string',
            field: 'owner.username'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "owner.id",
        header: DataTableColumnHeader,
        meta: {
            title: "ID владельца",
            type: 'string',
            field: 'owner.id'
        },
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={'users'} />
    },
    {
        accessorKey: "originalLink",
        header: DataTableColumnHeader,
        meta: {
            title: "Источник",
            type: 'string',
            field: 'originalLink'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "visibility",
        header: DataTableColumnHeader,
        meta: {
            title: "Публичность",
            type: 'string',
            field: 'visibility'
        },
    },
    {
        accessorKey: "createdAt",
        header: DataTableColumnHeader,
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
        header: DataTableColumnHeader,
        meta: {
            title: "Количество веток",
            type: 'number',
            field: 'branchCount'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "commitCount",
        header: DataTableColumnHeader,
        meta: {
            title: "Количество коммитов",
            type: 'number',
            field: 'commitCount'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<ApiEntityRepositoryModel>[]
