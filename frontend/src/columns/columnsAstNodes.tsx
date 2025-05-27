import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {
    DateRenderer,
    EntityIdRenderer,
    ListRenderer,
    MonoRenderer,
    OptRenderer
} from "@/components/custom/utils/ValueRenderers.tsx";
import type {ApiEntityAstNodeModel, ApiEntityAstTreeModel} from "@/store/store.ts";
import {type TypedColumnDef} from "@/lib/table.ts";
import dayjs from "dayjs";
import type {EntityField} from "@/lib/utils.ts";

export const fieldsAstNodes: EntityField[] = [
    {
        id: "id",
        name: "ID",
        type: "string"
    },
    // {
    //     id: "commitFile.hash",
    //     name: "Hash файла",
    //     type: "string"
    // },
    {
        id: "parent",
        name: "ID родителя",
        type: "string"
    },
    {
        id: "tree",
        name: "ID дерева",
        type: "string"
    },
    {
        id: "type",
        name: "Тип",
        type: "string"
    },
    {
        id: "label",
        name: "Значение",
        type: "string"
    },
    {
        id: "childrenCount",
        name: "Число прямых потомков",
        type: "int"
    },
    {
        id: 'children',
        name: 'Прямые потомки',
        type: 'list'
    },
];

export const columnsAstNodes = [
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
    {
        accessorKey: "type",
        header: DataTableColumnHeader,
        meta: {title: "Тип", type: "string", field: "type"},
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>,
    },
    {
        accessorKey: "label",
        header: DataTableColumnHeader,
        meta: {title: "Значение", type: "string", field: "label"},
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>,
    },
    // {
    //     accessorKey: "commitFile.hash",
    //     header: ({column}) => <DataTableColumnHeader column={column} title="Hash файла"/>,
    //     meta: {title: "Hash файла", type: "string", field: "commitFile.hash"},
    //     cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
    // },
    {
        accessorKey: "parent",
        header: DataTableColumnHeader,
        meta: {title: "ID родителя", type: "string", field: "parent"},
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={"ast-nodes"}/>,
    },
    {
        accessorKey: "tree",
        header: DataTableColumnHeader,
        meta: {title: "ID дерева", type: "string", field: "tree"},
        cell: ({cell}) => <EntityIdRenderer value={cell.getValue()} entity={"ast-trees"}/>,
    },
    {
        accessorKey: "childrenCount",
        header: DataTableColumnHeader,
        meta: {title: "Число прямых потомков", type: "int", field: "childrenCount"},
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>,
    },
    {
        accessorKey: 'children',
        header: DataTableColumnHeader,
        meta: { title: 'Прямые потомки', type: 'list', field: 'children' },
        cell: ({cell}) => <ListRenderer value={cell.getValue()} renderer={({value}) => <EntityIdRenderer value={value} entity={"ast-nodes"} /> } />
    },
] as TypedColumnDef<ApiEntityAstNodeModel>[]
