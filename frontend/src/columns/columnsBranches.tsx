import {Checkbox} from "@/components/ui/checkbox.tsx";
import DataTableColumnHeader from "@/components/custom/table/DataTableColumnHeader.tsx";
import {DateRenderer, MonoRenderer, OptRenderer} from "@/components/custom/utlis/ValueRenderers.tsx";
import type {ApiEntityBranchModel} from "@/store/store.ts";
import dayjs from "dayjs";
import type {TypedColumnDef} from "@/lib/table.ts";

const typesVisibilityType = {
    'PUBLIC': "Публичный",
    'PROTECTED': "Защищенный",
    'PRIVATE': "Приватный"
}

export const columnsBranches = [
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
        accessorKey: "repository.name",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Репозиторий"/>
            );
        },
        meta: {
            title: "Репозиторий",
            type: 'string',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
    {
        accessorKey: "isDefault",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="По-умолчанию"/>
            )
        },
        meta: {
            title: "По-умолчанию",
            type: 'boolean',
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
        accessorKey: "commitCount",
        header: ({column}) => {
            return (
                <DataTableColumnHeader column={column} title="Количество коммитов"/>
            )
        },
        meta: {
            title: "Количество коммитов",
            type: 'number',
        },
        cell: ({cell}) => <OptRenderer value={cell.getValue()} />
    },
] as TypedColumnDef<ApiEntityBranchModel>[]