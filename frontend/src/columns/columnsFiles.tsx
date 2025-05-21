import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utlis/ValueRenderers.tsx";
import type {ApiEntityRepositoryModel} from "@/store/store.ts";
import dayjs from "dayjs";
import type {TypedColumnDef} from "@/lib/table.ts";
import type {tempFile} from "@/routes/admin-panel/files/components/AdminFilesTableView.tsx";

export const typesType = {
    'FILE': "Файл",
    'DIRECTORY': "Директория",
}

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
        accessorKey: "hash",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="hash"/>
            )
        },
        meta: {
            title: "hash",
            type: 'string',
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
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "size",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Размер"/>
            )
        },
        meta: {
            title: "Размер",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "countStrings",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Количество строк"/>
            )
        },
        meta: {
            title: "Количество строк",
            type: 'number',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
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
        },
        cell: ({ cell }) => <DateRenderer value={cell.getValue()} />,
    },
    {
        accessorKey: "type",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Тип"/>
            )
        },
        accessorFn: (row) => {
            return typesType[row.type] ?? row.type
        },
        meta: {
            title: "Тип",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "commitName",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Коммит"/>
            )
        },
        meta: {
            title: "Коммит",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "repoName",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Репозиторий"/>
            )
        },
        meta: {
            title: "Репозиторий",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "author",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Автор"/>
            )
        },
        meta: {
            title: "Автор",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "changedAuthor",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Изменил"/>
            )
        },
        meta: {
            title: "Изменил",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<tempFile>[]