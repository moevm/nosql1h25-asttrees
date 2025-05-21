import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";
import type {ApiEntityAstTreeModel} from "@/store/store.ts";
import type {TypedColumnDef} from "@/lib/table.ts";
import dayjs from "dayjs";

export const columnsAstTrees = [
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
        cell: ({cell}) => <DateRenderer value={cell.getValue()}/>,
    },
    {
        accessorKey: "depth",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Глубина"/>
            );
        },
        meta: {
            title: "Глубина",
            type: 'number',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
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
            type: 'number',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "commitFile.name",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Название файла"/>
            )
        },
        meta: {
            title: "Название файла",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "commitFile.hash",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Hash файла"/>
            )
        },
        meta: {
            title: "Hash файла",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
] as TypedColumnDef<ApiEntityAstTreeModel>[]