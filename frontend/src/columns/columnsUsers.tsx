import {Checkbox} from "@/components/ui/checkbox.tsx";
import type {ApiEntityUserModel} from "@/store/store.ts";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import type {TypedColumnDef} from "@/lib/table.ts";
import type {EntityField} from "@/lib/utils.ts";
import dayjs from "dayjs";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";


export const fieldsUsers: EntityField[] = [
    {
        id: "id",
        name: "ID",
        type: "string",
    },
    {
        id: "username",
        name: "Никнейм",
        type: "string",
    },
    {
        id: "email",
        name: "Email",
        type: "string",
    },
    {
        id: "visibility",
        name: "Публичность",
        type: "string",
    },
    {
        id: "createdAt",
        name: "Дата создания",
        type: "date",
    },
    {
        id: "repositoryCount",
        name: "Количество репозиториев",
        type: "int",
    },
];

export const columnsUser = [
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
            type: "string",
            field: "id"
        },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()} />,
    },
    {
        accessorKey: "username",
        header: ({column}) => <DataTableColumnHeader column={column} title="Никнейм" />,
        meta: {
            title: "Никнейм",
            type: "string",
            field: "username"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />,
    },
    {
        accessorKey: "email",
        header: ({column}) => <DataTableColumnHeader column={column} title="Email" />,
        meta: {
            title: "Email",
            type: "string",
            field: "email"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />,
    },
    {
        accessorKey: "visibility",
        header: ({column}) => <DataTableColumnHeader column={column} title="Публичность" />,
        meta: {
            title: "Публичность",
            type: "string",
            field: "visibility"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />,
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => <DataTableColumnHeader column={column} title="Дата создания" />,
        meta: {
            title: "Дата создания",
            type: "datetime",
            field: "createdAt"
        },
        accessorFn: (row) => {
            return dayjs(row.createdAt);
        },
        cell: ({cell}) => <DateRenderer value={cell.getValue()} />,
    },
    {
        accessorKey: "repositoryCount",
        header: ({column}) => <DataTableColumnHeader column={column} title="Кол-во репозиториев" />,
        meta: {
            title: "Кол-во репозиториев",
            type: "number",
            field: "repositoryCount"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />,
    },
] as TypedColumnDef<ApiEntityUserModel>[]
