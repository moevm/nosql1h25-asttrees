import {Checkbox} from "@/components/ui/checkbox.tsx";
import type {ApiUserModel} from "@/store/store.ts";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {MonoRenderer, OptRenderer} from "@/components/custom/utlis/ValueRenderers.tsx";
import type {TypedColumnDef} from "@/lib/table.ts";

export const columnsUser = [
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
            selectFromFile: true,
        },
        cell: ({cell}) => <MonoRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "username",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Никнейм"/>
            )
        },
        meta: {
            title: "Никнейм",
            type: 'string',
            selectFromFile: true,
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "email",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Email"/>
            );
        },
        meta: {
            title: "Email",
            type: 'list',
        },
    },
    {
        accessorKey: "visibility",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Публичность"/>
            )
        },
        meta: {
            title: "Публичность",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
    {
        accessorKey: "repositoryCount",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Кол-во репозиториев"/>
            )
        },
        meta: {
            title: "Кол-во репозиториев",
            type: 'string'
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()}/>
    },
] as TypedColumnDef<ApiUserModel>[]
