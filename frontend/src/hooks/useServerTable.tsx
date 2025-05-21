import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";

import type {
    ColumnFiltersState,
    SortingState,
} from "@tanstack/table-core";
import {useEffect, useState} from "react";
import { $api, defaultOnErrorHandler } from "@/api";
import {toast} from "sonner";

type SortItem = {
    field: string;
    asc: boolean;
};

type FilterItem = {
    field: string;
    kind: "string" | "number" | "boolean" | "datetime";
    params: Record<string, any>;
};

interface ServerQuery {
    query: string;
    searchFields: string[];
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    sort: SortItem[];
    filter: FilterItem[];
}

interface ServerResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

interface UseServerTableOptions<T> {
    columns: any;
    searchFields: string[];
    queryUrl: string;
    defaultPageSize?: number;
    defaultQuery?: string;
}

export function useGetTableDataQuery(queryURL: string) {
    return $api.useMutation('post', `${queryURL}/query`, {
        onSuccess(data) {
            if (data) {
                toast.success('Данные успешно загружены!')
            }
        },
        onError: defaultOnErrorHandler
    })
}

export function useServerTable<T>({
                                      columns,
                                      searchFields,
                                      queryUrl,
                                      defaultPageSize = 10,
                                      defaultQuery = "",
                                  }: UseServerTableOptions<T>) {
    const [globalFilter, setGlobalFilter] = useState(defaultQuery);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });

    const [data, setData] = useState<ServerResponse<T> | null>(null);

    const queryBody: ServerQuery = {
        query: globalFilter,
        searchFields,
        pagination,
        sort: sorting.map((s) => ({ field: s.id, asc: !s.desc })),
        filter: columnFilters.map((f) => ({
            field: f.id,
            kind: typeof f.value === "number" ? "number" : "string",
            params: { value: f.value },
        })),
    };

    const { mutate, isPending } = useGetTableDataQuery<T>(queryUrl);

    // автоматический запуск при изменении фильтров, пагинации и т.д.
    useEffect(() => {
        mutate(
            { body: queryBody },
            {
                onSuccess: (res) => {
                    setData(res as ServerResponse<T>);
                },
            }
        );
    }, [globalFilter, sorting, columnFilters, pagination, queryUrl]);

    const table = useReactTable({
        data: data?.content || [],
        columns,
        pageCount: data ? Math.ceil(data.totalElements / pagination.pageSize) : -1,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return {
        data: data,
        table,
        isLoading: isPending,
        refetch: () => mutate({ body: queryBody }, {
            onSuccess: (res) => setData(res as ServerResponse<T>)
        }),
    };
}