import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import type {ApiEntityBranchModel} from "@/store/store.ts";
import dayjs from "dayjs";
import {type TypedColumnDef, typesVisibilityType} from "@/lib/table.ts";
import type {EntityField} from "@/lib/utils.ts";
import {CheckboxRenderer, DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";

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
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
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
            field: "name"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.name",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Название репозитория"/>
            );
        },
        meta: {
            title: "Название репозитория",
            type: 'string',
            field: "repository.name"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.owner.username",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Владелец репозитория"/>
            )
        },
        meta: {
            title: "Владелец репозитория",
            type: 'string',
            field: "repository.owner.username"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.originalLink",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Источник репозитория"/>
            )
        },
        meta: {
            title: "Источник репозитория",
            type: 'string',
            field: "repository.originalLink"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.visibility",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Публичность репозитория"/>
            )
        },
        meta: {
            title: "Публичность репозитория",
            type: 'string',
            field: "repository.visibility"
        },
        accessorFn: (row) => {
            return typesVisibilityType[row.repository.visibility] ?? row.repository.visibility
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.createdAt",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Дата создания репозитория"/>
            )
        },
        accessorFn: (row) => {
            return dayjs(row.createdAt);
        },
        meta: {
            title: "Дата создания репозитория",
            type: 'datetime',
            field: "repository.createdAt"
        },
        cell: ({cell}) => <DateRenderer value={cell.getValue()}/>,
    },
    {
        accessorKey: "isDefault",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Основная ветка"/>
            )
        },
        meta: {
            title: "Основная ветка",
            type: 'boolean',
            field: "isDefault"
        },
        cell: ({cell}) => <CheckboxRenderer value={cell.getValue()}/>
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
            field: "createdAt"
        },
        cell: ({cell}) => <DateRenderer value={cell.getValue()}/>,
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
            field: "commitCount"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
] as TypedColumnDef<ApiEntityBranchModel>[];