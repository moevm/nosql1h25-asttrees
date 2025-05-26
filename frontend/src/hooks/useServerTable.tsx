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
import {type FilterItem, FILTERS} from "@/lib/FILTERS.ts";
import dayjs from "dayjs";

type SortItem = {
    field: string;
    asc: boolean;
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

export function formatFilters(filters: FilterItem[]): FilterItem[] {
    return filters.map(f => {
        const fullFilter = FILTERS.find(it => it.id === f.kind)!
        return {
            field: f.field,
            kind: f.kind,
            params: Object.fromEntries(Object.entries(f.params).map(([k,v]) => {
                const def = fullFilter.params.find(it => it.id === k)!
                let value;
                switch (def.type) {
                    case "int":
                    case "string":
                    case "boolean":
                        value = v;
                        break
                    case "date":
                        value = dayjs(v as string).toISOString()
                        break;

                }
                return [k,value]
            }))
        }
    })
}

export function useGetTableDataQuery(queryURL: string) {
    return $api.useMutation('post', `${queryURL}/query`, {
        onSuccess(data) {
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
    const [filters, setFilters] = useState<FilterItem[]>([])
    const [searchFields, setSearchFields] = useState<string[]>([]);
    // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [initialized, setInitialized] = useState(false);
    // const setPath = useSetAtom($path);
    const [searchParams, setSearchParams] = useSearchParams();

    // const path = useAtomValue($path);

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
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
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
        sort: sorting.map((s) => {
            const col = table.getAllColumns().find((c) => c.id === s.id);
            return {
                field: col?.columnDef.meta?.field || s.id,
                asc: !s.desc,
            };
        }),
        filter: formatFilters(filters),
    }), [searchQuery, globalFilter, searchFields, pagination, sorting, filters, table]);

    useEffect(() => {
        const query = searchParams.get('query') ?? '';
        const fields = searchParams.get('fields')?.split(',') ?? [];
        const sort = searchParams.get('sort')?.split(',').map(part => {
            const [field, dir] = part.split(':');
            return { id: field, desc: dir === 'desc' };
        }) ?? [];

        const filters: FilterItem[] = JSON.parse(searchParams.get('filters') ?? '[]')

        const pageIndex = parseInt(searchParams.get('page') ?? '0', 10);
        const pageSize = parseInt(searchParams.get('size') ?? '10', 10);

        setSearchQuery(query);
        setSearchFields(fields);
        setSorting(sort);
        setFilters(filters);
        setPagination({ pageIndex, pageSize });
        setInitialized(true);
    }, [searchParams.toString()]);

    useEffect(() => {
        if (!initialized) {
            return
        }

        const newParams = new URLSearchParams(searchParams)
        if (searchQuery) {
            newParams.set('query', searchQuery);
        } else {
            newParams.delete('query')
        }

        if (searchFields.length) {
            newParams.set('fields', searchFields.join(','))
        } else {
            newParams.delete('fields')
        }

        if (sorting.length) {
            newParams.set('sort', sorting.map(it => `${it.id}:${it.desc ? 'desc' : 'asc'}`).join(','))
        } else {
            newParams.delete('sort')
        }

        newParams.delete('filters')
        if (filters.length) {
            newParams.set('filters', JSON.stringify(filters))
        }

        newParams.set('page', String(pagination.pageIndex))
        newParams.set('size', String(pagination.pageSize))

        setSearchParams(newParams)
    }, [initialized, pagination.pageIndex, pagination.pageSize, searchFields, searchParams, searchQuery, setSearchParams, sorting, filters]);

    useEffect(() => {
        if (!initialized) return;

        mutate(
            { body: { ...queryBody } },
            {
                onSuccess: (res) => {
                    setData(res as ServerResponse<T>);
                    // urlParams.set('path', urlParams.toString());
                },
            }
        );
    }, [queryBody]);

    useEffect(() => {
        if (!initialized) return;
        if (typeof data?.page?.totalPages !== 'number') return;

        if (pagination.pageIndex >= data?.page?.totalPages) {
            table.setPageIndex(data?.page?.totalPages - 1)
        }
    }, [initialized, pagination.pageIndex, data])

    return {
        data,
        table,
        isLoading: data?.content?.length ? false : isPending,
        isPending: isPending,
        filterString: searchQuery,
        setFilterString: setSearchQuery,
        searchPosition: searchFields,
        setSearchPosition: setSearchFields,
        filters,
        setFilters
    };
}
