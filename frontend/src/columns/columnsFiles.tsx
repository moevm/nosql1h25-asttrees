import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {
    CheckboxRenderer,
    DateRenderer,
    EntityIdRenderer, ListRenderer,
    MonoRenderer,
    OptRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import dayjs from "dayjs";
import {type TypedColumnDef, typesFileType} from "@/lib/table.ts";
import type {tempFile} from "@/routes/admin-panel/files/components/AdminFilesTableView.tsx";
import type {ApiEntityCommitFileModel} from "@/store/store.ts";
import type {EntityField} from "@/lib/utils.ts";

export const fieldsFiles: EntityField[] = [
    {
        id: "id",
        name: "ID",
        type: "string"
    },
    {
        id: "name",
        name: "Имя файла",
        type: "string"
    },
    {
        id: "fullPath",
        name: "Полный путь",
        type: "string"
    },
    {
        id: "type",
        name: "Тип файла",
        type: "string"
    },
    {
        id: "hash",
        name: "Hash файла",
        type: "string"
    },
    {
        id: "parent",
        name: "ID родителя",
        type: "string"
    },
    {
        id: "commit.id",
        name: "ID коммита",
        type: "string"
    },
    {
        id: "commit.hash",
        name: "Hash коммита",
        type: "string"
    },
    {
        id: "commit.author",
        name: "Автор коммита",
        type: "string"
    },
    {
        id: "commit.email",
        name: "Email автора коммита",
        type: "string"
    },
    {
        id: "commit.message",
        name: "Сообщение коммита",
        type: "string"
    },
    {
        id: "commit.filesChanged",
        name: "Изменено файлов (в коммите)",
        type: "int"
    },
    {
        id: "commit.linesAdded",
        name: "Добавлено строк (в коммите)",
        type: "int"
    },
    {
        id: "commit.linesRemoved",
        name: "Удалено строк (в коммите)",
        type: "int"
    },
    {
        id: "commit.createdAt",
        name: "Дата создания коммита",
        type: "date"
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
        id: "repository.owner",
        name: "ID владельца репозитория",
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
        id: "hasAst",
        name: "Есть AST",
        type: "boolean"
    },
    {
        id: "branchCount",
        name: "Количество веток",
        type: "int"
    },
    {
        id: "branches",
        name: "Ветки",
        type: 'list'
    },
    {
        id: "originalAuthor",
        name: "Первый автор",
        type: 'string'
    },
    {
        id: "lastChangedBy",
        name: "Последний изменивший",
        type: 'string'
    }
];

export const columnsFiles = [
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
        cell: ({row}) => <Checkbox className="row-select-checkbox" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Выбрать"/>,
        enableSorting: false,
        enableHiding: false,
        meta: { type: 'none' }
    },
    {
        accessorKey: "id",
        header: DataTableColumnHeader,
        meta: { title: "ID", type: 'string', field: "id" },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "name",
        header: DataTableColumnHeader,
        meta: { title: "Имя файла", type: 'string', field: "name" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "fullPath",
        header: DataTableColumnHeader,
        meta: { title: "Полный путь", type: 'string', field: "fullPath" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "type",
        header: DataTableColumnHeader,
        meta: { title: "Тип файла", type: 'string', field: "type" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "hash",
        header: DataTableColumnHeader,
        meta: { title: "Hash файла", type: 'string', field: "hash" },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "parent",
        header: DataTableColumnHeader,
        meta: { title: "ID родителя", type: 'string', field: "parent" },
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={'files'}/>
    },
    {
        accessorKey: "commit.id",
        header: DataTableColumnHeader,
        meta: { title: "ID коммита", type: 'string', field: "commit.id" },
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={'commits'}/>
    },
    {
        accessorKey: "commit.hash",
        header: DataTableColumnHeader,
        meta: { title: "Hash коммита", type: 'string', field: "commit.hash" },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "commit.author",
        header: DataTableColumnHeader,
        meta: { title: "Автор коммита", type: 'string', field: "commit.author" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "commit.message",
        header: DataTableColumnHeader,
        meta: { title: "Сообщение коммита", type: 'string', field: "commit.message" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "commit.createdAt",
        header: DataTableColumnHeader,
        accessorFn: (row) => row.commit ? dayjs(row.commit.createdAt) : undefined,
        meta: { title: "Дата коммита", type: 'datetime', field: "commit.createdAt" },
        cell: ({cell}) => <DateRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.id",
        header: DataTableColumnHeader,
        meta: { title: "ID репозитория", type: 'string', field: "repository.id" },
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={'repos'}/>
    },
    {
        accessorKey: "repository.name",
        header: DataTableColumnHeader,
        meta: { title: "Название репозитория", type: 'string', field: "repository.name" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.owner",
        header: DataTableColumnHeader,
        meta: { title: "ID владельца репозитория", type: 'string', field: "repository.owner" },
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={'users'}/>
    },
    {
        accessorKey: "hasAst",
        header: DataTableColumnHeader,
        meta: { title: "Есть AST", type: 'boolean', field: "hasAst" },
        cell: ({cell}) => <CheckboxRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "branchCount",
        header: DataTableColumnHeader,
        meta: { title: "Количество веток", type: "number", field: "branchCount" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: 'branches',
        header: DataTableColumnHeader,
        meta: { title: 'Ветки', type: 'list', field: 'branches' },
        cell: ({cell}) => <ListRenderer value={cell.getValue()} renderer={({value}) => <EntityIdRenderer value={value} entity={"branches"} /> } />
    },
    {
        accessorKey: "originalAuthor",
        header: DataTableColumnHeader,
        meta: { title: "Первый автор", type: 'string', field: "originalAuthor" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "lastChangedBy",
        header: DataTableColumnHeader,
        meta: { title: "Последний изменивший", type: 'string', field: "lastChangedBy" },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
] as TypedColumnDef<ApiEntityCommitFileModel>[]
