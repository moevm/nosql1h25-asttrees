import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type {Column, Table} from "@tanstack/react-table";
import {MultiSelect} from "@/components/custom/multi-select/MultiSelect.tsx";

interface DataTableViewOptionsProps<TData> {
    allTableColumns: Column<TData, unknown>[]
    visibleColumns: string[],
    setVisibleColumns: (value: string[]) => void
}

export function DataTableViewOptions<TData>(
    {
        allTableColumns,
        visibleColumns,
        setVisibleColumns
    }: DataTableViewOptionsProps<TData>
) {

    return (
        <MultiSelect
            asChild
            options={
                allTableColumns
                    .map((it) => {
                        return {
                            label: it.columnDef.meta?.title || it.id,
                            value: it.id
                        }
                    })}
            defaultValue={visibleColumns}
            onValueChange={setVisibleColumns}
        >
            <Button
                variant="outline"
                size="sm"
            >
                <Settings2/>
                Вид
            </Button>
        </MultiSelect>
    )
}
