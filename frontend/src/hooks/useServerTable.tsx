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
                                      queryUrl,
                                      defaultPageSize = 10,
                                      defaultQuery = "",
                                  }: UseServerTableOptions<T>) {
    const [globalFilter, setGlobalFilter] = useState(defaultQuery);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFields, setSearchFields] = useState<string[]>([]);
    const [sortingForQuery, setSortingForQuery] = useState<EntityField[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });

    const [data, setData] = useState<ServerResponse<T> | null>(null);
    const { mutate, isPending } = useGetTableDataQuery<T>(queryUrl);

    const table = useReactTable({
        data: data?.content ?? [],
        columns,
        pageCount: data?.totalPages ?? -1,
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
        query: searchQuery, ///////
        globalFilter,
        searchFields,
        pagination,
        sort: sortingForQuery,
        filter: columnFilters.map((f) => ({
            field: f.id,
            kind: typeof f.value === "number" ? "number" : "string",
            params: { value: f.value },
        })),
    }), [searchQuery, globalFilter, searchFields, pagination, sortingForQuery, columnFilters]);

    useEffect(() => {
        const mappedSorting = sorting.map((s) => {
            const col = table.getAllColumns().find((c) => c.id === s.id);
            return {
                field: col?.columnDef.meta?.field || s.id,
                asc: !s.desc,
            };
        });

        setSortingForQuery(mappedSorting as EntityField[]);

        mutate(
            { body: { ...queryBody, sort: mappedSorting } },
            {
                onSuccess: (res) => {
                    setData(res as ServerResponse<T>);
                },
            }
        );
    }, [searchQuery, globalFilter, sorting, columnFilters, pagination]);

    return {
        data,
        table,
        isLoading: isPending,
        filterString: searchQuery,
        setFilterString: setSearchQuery,
        searchPosition: searchFields,
        setSearchPosition: setSearchFields,
        refetch: () =>
            mutate(
                { body: queryBody },
                { onSuccess: (res) => setData(res as ServerResponse<T>) }
            ),
    };
}