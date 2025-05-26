import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";
import type {ApiEntityAstTreeModel} from "@/store/store.ts";
import {type TypedColumnDef} from "@/lib/table.ts";
import dayjs from "dayjs";
import type {EntityField} from "@/lib/utils.ts";

export const fieldsAstTrees: EntityField[] = [
    {
        id: "id",
        name: "ID",
        type: "string"
    },
    // {
    //     id: "hash",
    //     name: "Hash",
    //     type: "string"
    // },
    {
        id: "createdAt",
        name: "Дата создания",
        type: "date"
    },
    {
        id: "depth",
        name: "Глубина",
        type: "int"
    },
    {
        id: "size",
        name: "Размер",
        type: "int"
    },
    // {
    //     id: "commitFile.hash",
    //     name: "Hash файла",
    //     type: "string"
    // },
];

export const columnsAstTrees = [
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
        meta: {type: "none"}
    },
    {
        accessorKey: "id",
        header: DataTableColumnHeader,
        meta: {title: "id", type: "string", field: "id"},
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>,
    },
    // {
    //     accessorKey: "commitFile.hash",
    //     header: ({column}) => <DataTableColumnHeader column={column} title="Hash файла"/>,
    //     meta: {title: "Hash файла", type: "string", field: "commitFile.hash"},
    //     cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
    // },
    {
        accessorKey: "createdAt",
        header: DataTableColumnHeader,
        meta: {title: "Дата создания", type: "datetime", field: "createdAt"},
        accessorFn: (row) => dayjs(row.createdAt),
        cell: ({cell}) => <DateRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "depth",
        header: DataTableColumnHeader,
        meta: {title: "Глубина", type: "number", field: "depth"},
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "size",
        header: DataTableColumnHeader,
        meta: {title: "Размер", type: "number", field: "size"},
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
] as TypedColumnDef<ApiEntityAstTreeModel>[]
