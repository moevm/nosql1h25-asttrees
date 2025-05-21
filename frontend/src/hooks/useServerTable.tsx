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
import {useEffect, useMemo, useState} from "react";
import { $api, defaultOnErrorHandler } from "@/api";
import {toast} from "sonner";
import type {EntityField} from "@/lib/utils.ts";

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
    const [sortingForQuery, setsortingForQuery] = useState<EntityField[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });
    const [data, setData] = useState<ServerResponse<T> | null>(null);

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


    const queryBody: ServerQuery = useMemo(() => ({
        query: globalFilter,
        searchFields,
        pagination,
        // sort: sorting.map((s) => ({ field: s.id, asc: !s.desc })),
        sort: sortingForQuery,
        filter: columnFilters.map((f) => ({
            field: f.id,
            kind: typeof f.value === "number" ? "number" : "string",
            params: { value: f.value },
        })),
    }), [globalFilter, searchFields, pagination, sortingForQuery, columnFilters]);

    const { mutate, isPending } = useGetTableDataQuery<T>(queryUrl);



    useEffect(() => {
        console.info({
            sorting,
            columns: table.getAllColumns()
        })
        const mappedSorting = sorting.map((s) => {
            const col = table.getAllColumns().find((c) => c.id === s.id);

            const field = col?.columnDef?.meta?.field || s.id;
            return { field, asc: !s.desc };
        });

        setsortingForQuery(mappedSorting as EntityField[]);

        mutate(
            { body: { ...queryBody, sort: mappedSorting } },
            {
                onSuccess: (res) => {
                    setData(res as ServerResponse<T>);
                    console.log("Query body", queryBody);
                    console.log("Sorting used:", mappedSorting);
                },
            }
        );
    }, [globalFilter, sorting, columnFilters, pagination, queryUrl]);

    return {
        data: data,
        table,
        isLoading: isPending,
        refetch: () => mutate({ body: queryBody }, {
            onSuccess: (res) => setData(res as ServerResponse<T>)
        }),
    };
}