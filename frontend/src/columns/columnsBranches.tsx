import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import type {ApiEntityBranchModel} from "@/store/store.ts";
import dayjs from "dayjs";
import {type TypedColumnDef, typesVisibilityType} from "@/lib/table.ts";
import type {EntityField} from "@/lib/utils.ts";
import {
    CheckboxRenderer,
    DateRenderer,
    EntityIdRenderer, ListRenderer,
    MonoRenderer,
    OptRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";

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
        name: "ID репозитория",
        type: "string"
    },
    {
        id: "repository.name",
        name: "Название репозитория",
        type: "string"
    },
    {
        id: "repository.createdAt",
        name: "Дата создания репозитория",
        type: "date"
    },
    {
        id: "repository.owner.id",
        name: "ID владельца репозитория",
        type: "string"
    },
    {
        id: "repository.owner.username",
        name: "Никнейм владельца репозитория",
        type: "string"
    },
    {
        id: "repository.originalLink",
        name: "Источник репозитория",
        type: "string"
    },
    {
        id: "repository.visibility",
        name: "Публичность репозитория",
        type: "string"
    },
    {
        id: "isDefault",
        name: "Основная ветка",
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
    },
    {
        id: 'commits',
        name: 'Коммиты',
        type: 'list'
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
        header: DataTableColumnHeader,
        meta: {
            title: "id",
            type: 'string',
            field: "id"
        },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "name",
        header: DataTableColumnHeader,
        meta: {
            title: "Название",
            type: 'string',
            field: "name"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.id",
        header: DataTableColumnHeader,
        meta: {
            title: "ID репозитория",
            type: 'string',
            field: "repository.id"
        },
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={'repos'}/>
    },
    {
        accessorKey: "repository.name",
        header: DataTableColumnHeader,
        meta: {
            title: "Название репозитория",
            type: 'string',
            field: "repository.name"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.visibility",
        header: DataTableColumnHeader,
        meta: {
            title: "Публичность репозитория",
            type: 'string',
            field: "repository.visibility"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repository.createdAt",
        header: DataTableColumnHeader,
        accessorFn: (row) => {
            return row.repository ? dayjs(row.repository!.createdAt) : undefined
        },
        meta: {
            title: "Дата создания репозитория",
            type: 'datetime',
            field: "repository.createdAt"
        },
        cell: ({cell}) => <DateRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repository.owner.id",
        header: DataTableColumnHeader,
        meta: {
            title: "ID владельца репозитория",
            type: 'string',
            field: "repository.owner.id"
        },
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={'users'}/>
    },
    {
        accessorKey: "repository.owner.username",
        header: DataTableColumnHeader,
        meta: {
            title: "Никнейм владельца репозитория",
            type: 'string',
            field: "repository.owner.username"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.originalLink",
        header: DataTableColumnHeader,
        meta: {
            title: "Источник репозитория",
            type: 'string',
            field: "repository.originalLink"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "isDefault",
        header: DataTableColumnHeader,
        meta: {
            title: "Основная ветка",
            type: 'boolean',
            field: "isDefault"
        },
        cell: ({cell}) => <CheckboxRenderer value={cell.getValue()}/>
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
            field: "createdAt"
        },
        cell: ({cell}) => <DateRenderer value={cell.getValue()}/>,
    },
    {
        accessorKey: "commitCount",
        header: DataTableColumnHeader,
        meta: {
            title: "Количество коммитов",
            type: 'number',
            field: "commitCount"
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: 'commits',
        header: DataTableColumnHeader,
        meta: { title: 'Коммиты', type: 'list', field: 'commits' },
        cell: ({cell}) => <ListRenderer value={cell.getValue()} renderer={({value}) => <EntityIdRenderer value={value} entity={"commits"} /> } />
    },
] as TypedColumnDef<ApiEntityBranchModel>[];
