import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import type {ApiEntityBranchModel} from "@/store/store.ts";
import dayjs from "dayjs";
import type {TypedColumnDef} from "@/lib/table.ts";
import type {EntityField} from "@/lib/utils.ts";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";

export const fieldsBranches: EntityField[] = [
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
        id: "repository.id",
        name: "id репозитория",
        type: "string"
    },
    {
        id: "repository.name",
        name: "Название репозитория",
        type: "string"
    },
    {
        id: "repository.owner.id",
        name: "id владельца репозитория",
        type: "string"
    },
    {
        id: "repository.owner.username",
        name: "Никнейм владельца репозитория",
        type: "string"
    },
    {
        id: "repository.originalLink",
        name: "URL репозитория",
        type: "string"
    },
    {
        id: "repository.createdAt",
        name: "Дата создания репозитория",
        type: "date"
    },
    {
        id: "repository.visibility",
        name: "Доступность репозитория",
        type: "string"
    },
    {
        id: "isDefault",
        name: "По умолчанию",
        type: "boolean"
    },
    {
        id: "createdAt",
        name: "Дата создания",
        type: "date"
    },
    {
        id: "commitCount",
        name: "Количество коммитов",
        type: "int"
    }
];

export const columnsBranches = [
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
        header: ({column}) => <DataTableColumnHeader column={column} title="ID" />,
        meta: {
            title: "ID",
            type: 'string',
            field: "id"
        },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "name",
        header: ({column}) => <DataTableColumnHeader column={column} title="Название" />,
        meta: {
            title: "Название",
            type: 'string',
            field: "name"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repository.name",
        header: ({column}) => <DataTableColumnHeader column={column} title="Репозиторий" />,
        meta: {
            title: "Репозиторий",
            type: 'string',
            field: "repository.name"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "isDefault",
        header: ({column}) => <DataTableColumnHeader column={column} title="По умолчанию" />,
        meta: {
            title: "По умолчанию",
            type: 'boolean',
            field: "isDefault"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => <DataTableColumnHeader column={column} title="Дата создания" />,
        accessorFn: (row) => dayjs(row.createdAt),
        meta: {
            title: "Дата создания",
            type: 'datetime',
            field: "createdAt"
        },
        cell: ({ cell }) => <DateRenderer value={cell.getValue()} />,
    },
    {
        accessorKey: "commitCount",
        header: ({column}) => <DataTableColumnHeader column={column} title="Количество коммитов" />,
        meta: {
            title: "Количество коммитов",
            type: 'number',
            field: "commitCount"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<ApiEntityBranchModel>[];