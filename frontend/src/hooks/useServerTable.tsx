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
import {useAtomValue, useSetAtom} from "jotai/react";
import {$path} from "@/store/store.ts";
import {useNavigate, useSearchParams} from "react-router-dom";

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
    const [initialized, setInitialized] = useState(false);
    const setPath = useSetAtom($path);
    const [searchParams, setSearchParams] = useSearchParams();

    const path = useAtomValue($path);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });

    const [data, setData] = useState<ServerResponse<T> | null>(null);
    const { mutate, isPending } = useGetTableDataQuery<T>(queryUrl);
    const navigate = useNavigate();

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
        if (!path || initialized) return;
        const params = new URLSearchParams(path);

        const query = params.get('query') ?? '';
        const fields = params.get('fields')?.split(',') ?? [];
        const sort = params.get('sort')?.split(',').map(part => {
            const [field, dir] = part.split(':');
            return { id: field, desc: dir === 'desc' };
        }) ?? [];

        const filters = params.get('filters')?.split(',').map(item => {
            const [keyKind, val] = item.split('=');
            const [field, kind] = keyKind.split(':');
            return { id: field, value: decodeURIComponent(val) };
        }) ?? [];

        const pageIndex = parseInt(params.get('page') ?? '0', 10);
        const pageSize = parseInt(params.get('size') ?? '10', 10);

        setSearchQuery(query);
        setSearchFields(fields);
        setSorting(sort);
        setColumnFilters(filters);
        setPagination({ pageIndex, pageSize });

        setInitialized(true);
    }, [path]);

    useEffect(() => {
        if (!initialized && path) return;

        const mappedSorting = sorting.map((s) => {
            const col = table.getAllColumns().find((c) => c.id === s.id);
            return {
                field: col?.columnDef.meta?.field || s.id,
                asc: !s.desc,
            };
        });

        setSortingForQuery(mappedSorting as EntityField[]);

        const urlParams = new URLSearchParams();
        if (searchQuery) urlParams.set("query", searchQuery);
        if (searchFields.length) urlParams.set("fields", searchFields.join(","));
        if (mappedSorting.length)
            urlParams.set("sort", mappedSorting.map(s => `${s.field}:${s.asc ? "asc" : "desc"}`).join(","));
        if (columnFilters.length)
            urlParams.set("filters", columnFilters.map(f =>
                `${f.id}:${typeof f.value === "number" ? "number" : "string"}=${encodeURIComponent(f.value)}`
            ).join(","));
        urlParams.set("page", String(pagination.pageIndex));
        urlParams.set("size", String(pagination.pageSize));


        mutate(
            { body: { ...queryBody, sort: mappedSorting } },
            {
                onSuccess: (res) => {
                    console.info('setData', {res})
                    setData(res as ServerResponse<T>);
                    urlParams.set('path', urlParams.toString());
                    setSearchParams(urlParams);
                    console.log(urlParams)
                },
            }
        );
    }, [initialized, searchQuery, globalFilter, sorting, columnFilters, pagination, searchFields]);

    return {
        data,
        table,
        isLoading: data?.content?.length ? false : isPending,
        isPending: isPending,
        filterString: searchQuery,
        setFilterString: setSearchQuery,
        searchPosition: searchFields,
        setSearchPosition: setSearchFields,
    };
}