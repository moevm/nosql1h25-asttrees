import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Table } from "@tanstack/react-table"
import React from "react";

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    totalItems?: number,
    size?: number,
    number?: number,
    totalPages?: number
}

export function DataTablePagination<TData>({
                                               table,
                                               totalItems,
                                               size,
                                               number,
                                               totalPages,
                                           }: DataTablePaginationProps<TData>) {
    const fallback = table.getState().pagination

    const pageSize = size ?? fallback.pageSize
    const pageIndex = number ?? fallback.pageIndex
    const pageCount = totalPages ?? table.getPageCount()

    const canPreviousPage = pageIndex > 0
    const canNextPage = pageIndex < pageCount - 1

    return (
        <div className="flex items-center justify-between px-2 py-2">
            <div className="flex-1 text-sm text-muted-foreground pl-2">
                Всего {totalItems ?? "…"} строк.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Строк на странице</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={`${pageSize}`} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {pageCount > 1 && (
                    <>
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                            Стр. {pageIndex + 1} из {pageCount}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">Первая</span>
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.previousPage()}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">Назад</span>
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.nextPage()}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">Вперёд</span>
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(pageCount - 1)}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">Последняя</span>
                                <ChevronsRight />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
