import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import type {ApiEntityCommitModel} from "@/store/store.ts";
import dayjs from "dayjs";
import {type TypedColumnDef, typesVisibilityType} from "@/lib/table.ts";
import type {EntityField} from "@/lib/utils.ts";
import {DateRenderer, EntityIdRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";

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
        header: DataTableColumnHeader,
        meta: { title: "id", type: "string", field: "id" },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>,
    },
    {
        accessorKey: "hash",
        header: DataTableColumnHeader,
        meta: { title: "Hash", type: "string", field: "hash" },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "author",
        header: DataTableColumnHeader,
        meta: { title: "Автор", type: "string", field: "author" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "email",
        header: DataTableColumnHeader,
        meta: { title: "Email", type: "string", field: "email" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "message",
        header: DataTableColumnHeader,
        meta: { title: "Сообщение", type: "string", field: "message" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "filesChanged",
        header: DataTableColumnHeader,
        meta: { title: "Файлов изменено", type: "number", field: "filesChanged" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "linesAdded",
        header: DataTableColumnHeader,
        meta: { title: "Строк добавлено", type: "number", field: "linesAdded" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "linesRemoved",
        header: DataTableColumnHeader,
        meta: { title: "Строк удалено", type: "number", field: "linesRemoved" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
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
        accessorKey: "branchCount",
        header: DataTableColumnHeader,
        meta: { title: "Количество веток", type: "number", field: "branchCount" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "fileCount",
        header: DataTableColumnHeader,
        meta: { title: "Количество файлов", type: "number", field: "fileCount" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "fileWithAstCount",
        header: DataTableColumnHeader,
        meta: { title: "Файлы с AST", type: "number", field: "fileWithAstCount" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "createdAt",
        header: DataTableColumnHeader,
        meta: { title: "Дата коммита", type: "datetime", field: "createdAt" },
        accessorFn: (row) => dayjs(row.createdAt),
        cell: ({cell}) => <DateRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<ApiEntityCommitModel>[];
