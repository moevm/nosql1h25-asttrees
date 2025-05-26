import {ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, Filter, Search, X} from "lucide-react"

import {cn, type EntityField} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {Column} from "@tanstack/react-table";
import {useMemo, useState} from "react";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
    entityField?: EntityField,
    addFilter: () => void,
    addSearch: () => void,
}

function DataTableColumnHeader<TData, TValue>(
    {
        column,
        className,
        entityField,
        addFilter,
        addSearch
    }: DataTableColumnHeaderProps<TData, TValue>
) {
    const [open, setOpen] = useState(false)

    const title = useMemo(() => {
        return column.columnDef.meta?.title ?? column.id
    }, [])
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDown/>
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUp/>
                        ) : (
                            <ChevronsUpDown/>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={(e) => {
                        // setOpen(false)
                        // e.stopPropagation()
                        // e.preventDefault()
                        column.toggleSorting(false)
                    }}>
                        <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70"/>
                        По возрастанию
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                        // setOpen(false)
                        // e.stopPropagation()
                        // e.preventDefault()
                        column.toggleSorting(true)
                    }}>
                        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70"/>
                        По убыванию
                    </DropdownMenuItem>
                    {column.getIsSorted() && <DropdownMenuItem onClick={(e) => {
                        // setOpen(false)
                        // e.stopPropagation()
                        // e.preventDefault()
                        column.clearSorting()
                    }}>
                        <X className="h-3.5 w-3.5 text-muted-foreground/70"/>
                        Не сортировать
                    </DropdownMenuItem>}
                    {entityField && (<>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={(e) => {
                            setOpen(false)
                            e.stopPropagation()
                            e.preventDefault()
                            addFilter()
                        }}>
                            <Filter className="h-3.5 w-3.5 text-muted-foreground/70"/>
                            Фильтровать
                        </DropdownMenuItem>
                        {entityField.type === 'string' && (
                            <DropdownMenuItem onClick={(e) => {
                                setOpen(false)
                                e.stopPropagation()
                                e.preventDefault()
                                addSearch()
                            }}>
                                <Search className="h-3.5 w-3.5 text-muted-foreground/70"/>
                                Поиск
                            </DropdownMenuItem>
                        )}
                    </>)}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default DataTableColumnHeader
