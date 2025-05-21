import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import type {ApiEntityCommitModel} from "@/store/store.ts";
import dayjs from "dayjs";
import type {TypedColumnDef} from "@/lib/table.ts";
import type {EntityField} from "@/lib/utils.ts";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";

const typesVisibilityType = {
    'PUBLIC': "Публичный",
    'PROTECTED': "Защищенный",
    'PRIVATE': "Приватный"
}

export const fieldsCommits: EntityField[] = [
    {
        id: "id",
        name: "ID",
        type: "string"
    },
    {
        id: "hash",
        name: "Hash",
        type: "string"
    },
    {
        id: "author",
        name: "Автор",
        type: "string"
    },
    {
        id: "email",
        name: "Email",
        type: "string"
    },
    {
        id: "message",
        name: "Сообщение",
        type: "string"
    },
    {
        id: "filesChanged",
        name: "Файлов изменено",
        type: "int"
    },
    {
        id: "linesAdded",
        name: "Строк добавлено",
        type: "int"
    },
    {
        id: "linesRemoved",
        name: "Строк удалено",
        type: "int"
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
        name: "Владелец репозитория",
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
        id: "repository.createdAt",
        name: "Дата создания репозитория",
        type: "date"
    },
    {
        id: "branchCount",
        name: "Количество веток",
        type: "int"
    },
    {
        id: "fileCount",
        name: "Количество файлов",
        type: "int"
    },
    {
        id: "fileWithAstCount",
        name: "Файлов с AST",
        type: "int"
    },
    {
        id: "createdAt",
        name: "Дата создания",
        type: "date"
    }
];

export const columnsCommits = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        meta: { type: "none" }
    },
    {
        accessorKey: "id",
        header: ({column}) => <DataTableColumnHeader column={column} title="id"/>,
        meta: { title: "id", type: "string", field: "id" },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>,
    },
    {
        accessorKey: "hash",
        header: ({column}) => <DataTableColumnHeader column={column} title="Hash"/>,
        meta: { title: "Hash", type: "string", field: "hash" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "author",
        header: ({column}) => <DataTableColumnHeader column={column} title="Автор"/>,
        meta: { title: "Автор", type: "string", field: "author" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "email",
        header: ({column}) => <DataTableColumnHeader column={column} title="Email"/>,
        meta: { title: "Email", type: "string", field: "email" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "message",
        header: ({column}) => <DataTableColumnHeader column={column} title="Сообщение"/>,
        meta: { title: "Сообщение", type: "string", field: "message" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "filesChanged",
        header: ({column}) => <DataTableColumnHeader column={column} title="Файлов изменено"/>,
        meta: { title: "Файлов изменено", type: "number", field: "filesChanged" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "linesChanged",
        header: ({column}) => <DataTableColumnHeader column={column} title="Строк изменено"/>,
        meta: { title: "Строк изменено", type: "string", field: "linesAdded" }, // Используем linesAdded, т.к. это base
        accessorFn: (row) => `+${row.linesAdded}/-${row.linesRemoved}`,
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repository.name",
        header: ({column}) => <DataTableColumnHeader column={column} title="Название репозитория"/>,
        meta: { title: "Название репозитория", type: "string", field: "repository.name" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repository.owner.username",
        header: ({column}) => <DataTableColumnHeader column={column} title="Владелец репозитория"/>,
        meta: { title: "Владелец репозитория", type: "string", field: "repository.owner.username" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repository.originalLink",
        header: ({column}) => <DataTableColumnHeader column={column} title="Источник репозитория"/>,
        meta: { title: "Источник репозитория", type: "string", field: "repository.originalLink" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repository.visibility",
        header: ({column}) => <DataTableColumnHeader column={column} title="Публичность репозитория"/>,
        meta: { title: "Публичность репозитория", type: "string", field: "repository.visibility" },
        accessorFn: (row) => typesVisibilityType[row.repository?.visibility] ?? row.repository?.visibility,
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repository.createdAt",
        header: ({column}) => <DataTableColumnHeader column={column} title="Дата создания репозитория"/>,
        meta: { title: "Дата создания репозитория", type: "datetime", field: "repository.createdAt" },
        accessorFn: (row) => dayjs(row.repository?.createdAt),
        cell: ({cell}) => <DateRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "branchCount",
        header: ({column}) => <DataTableColumnHeader column={column} title="Количество веток"/>,
        meta: { title: "Количество веток", type: "number", field: "branchCount" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "fileCount",
        header: ({column}) => <DataTableColumnHeader column={column} title="Количество файлов"/>,
        meta: { title: "Количество файлов", type: "number", field: "fileCount" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "fileWithAstCount",
        header: ({column}) => <DataTableColumnHeader column={column} title="Файлы с AST"/>,
        meta: { title: "Файлы с AST", type: "number", field: "fileWithAstCount" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => <DataTableColumnHeader column={column} title="Дата коммита"/>,
        meta: { title: "Дата коммита", type: "datetime", field: "createdAt" },
        accessorFn: (row) => dayjs(row.createdAt),
        cell: ({cell}) => <DateRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<ApiEntityCommitModel>[];