import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";
import type {ApiEntityCommitModel} from "@/store/store.ts";
import dayjs from "dayjs";
import {type TypedColumnDef, typesVisibilityType} from "@/lib/table.ts";

export const columnsCommits = [
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
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "hash",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Hash"/>
            )
        },
        meta: {
            title: "Hash",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "author",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Автор"/>
            );
        },
        meta: {
            title: "Автор",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "email",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Email"/>
            )
        },
        meta: {
            title: "Email",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "message",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Сообщение"/>
            )
        },
        meta: {
            title: "Сообщение",
            type: 'string'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "filesChanged",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Файлов изменено"/>
            )
        },
        accessorFn: (row) => {
            return dayjs(row.createdAt);
        },
        meta: {
            title: "Файлов изменено",
            type: 'number',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "linesChanged",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Строк изменено"/>
            )
        },
        meta: {
            title: "Строк изменено",
            type: 'string',
        },
        accessorFn: (row) => {
            return `+${row.linesAdded}/-${row.linesRemoved}`;
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repository.name",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Название репозитория"/>
            )
        },
        meta: {
            title: "Название репозитория",
            type: 'string',
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
        },
        cell: ({cell}) => <DateRenderer value={cell.getValue()}/>,
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
            type: 'number'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "fileCount",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Количество файлов"/>
            )
        },
        meta: {
            title: "Количество файлов",
            type: 'number'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "fileWithAstCount",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Количество файлов с AST"/>
            )
        },
        meta: {
            title: "Количество файлов с AST",
            type: 'number'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
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
            type: 'datetime'
        },
        cell: ({cell}) => <DateRenderer value={cell.getValue()}/>,
    },
] as TypedColumnDef<ApiEntityCommitModel>[]