import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {MonoRenderer, OptRenderer} from "@/components/custom/utlis/ValueRenderers.tsx";
import type {ApiEntityBranchModel} from "@/store/store.ts";
import type {TypedColumnDef} from "@/lib/table.ts";

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
        cell: ({cell}) => <MonoRenderer value={cell.getValue()} />
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
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
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
            type: 'number',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<ApiEntityBranchModel>[]