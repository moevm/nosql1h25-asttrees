import * as React from "react";
import {
    flexRender,
    useReactTable
} from "@tanstack/react-table";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {MultiSelect} from "@/components/custom/multi-select/MultiSelect.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChartNetwork, Filter, SettingsIcon} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {DataTablePagination} from "@/components/custom/table/DataTablePagination.tsx";
import {DataTableViewOptions} from "@/components/custom/table/DataTableViewOptions.tsx";
import {getColumnTypeRelations, relationFullName} from "@/lib/table.ts";
import {useAtomValue, useSetAtom} from "jotai/react";
import {$currentEntitiesFieldsAtom, $hideColumnsAtomFamily, $path, $showVisualizationDialog} from "@/store/store.ts";
import VisualizationDialog from "@/components/dialogs/VisualizationDialog.tsx";
import type {EntityField} from "@/lib/utils.ts";
import * as Progress from '@radix-ui/react-progress'
import type {FilterItem} from "@/lib/filters.ts";
import TableFilters from "@/components/custom/table/TableFilters.tsx";
import {useAtom} from "jotai";

const ProgressDemo = () => {
    return (
        <Progress.Root className="ProgressRoot">
            <Progress.Indicator
                className="ProgressIndicator"
                style={
                    {animation: "progress-indeterminate 1000ms infinite linear"}
                }
            />
        </Progress.Root>
    );
};

interface RichTableViewProps<TData, TValue> {
    table: ReturnType<typeof useReactTable<TData>>;
    isLoading: boolean;
    isPending: boolean
    entityType: EntityField[];
    queryURLname: string;
    data?: {
        totalElements?: number,
        size?: number,
        number?: number,
        totalPages?: number
    } | null;
    settings?: {
        enableSearch?: boolean;
        enableVisualization?: boolean;
        enableColumnVisibilityToggle?: boolean;
        rowClickHandler?: (data: TData) => void;
    };
    filterString: string;
    setFilterString: (value: string) => void;
    searchPosition: string[];
    setSearchPosition: (value: string[]) => void;
    buttonsSlot?: () => React.ReactNode;
    filters: FilterItem[]
    setFilters: (value: FilterItem[]) => void
}

function RichTableView<TData, TValue>({
                                          table,
                                          isLoading,
                                          isPending,
                                          entityType,
                                          queryURLname,
                                          data = {},
                                          settings = {},
                                          filterString,
                                          setFilterString,
                                          searchPosition,
                                          setSearchPosition,
                                          buttonsSlot,
                                          filters,
                                          setFilters
                                      }: RichTableViewProps<TData, TValue>) {
    const [hiddenColumns, setHiddenColumns] = useAtom($hideColumnsAtomFamily(queryURLname))

    const allTableColumns = useMemo(() => {
        return table.getAllColumns()
            .filter(
                (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
    }, [table])

    const visibleColumns = useMemo(() => {
        return allTableColumns.filter(it => !hiddenColumns.includes(it.id)).map(it => it.id)
    }, [allTableColumns, hiddenColumns])

    const setVisibleColumns = useCallback((newVisibleColumns: string[]) => {
        setHiddenColumns(
            allTableColumns
                .filter(it => !newVisibleColumns.includes(it.id))
                .map(it => it.id)
        )

    }, [allTableColumns, setHiddenColumns])


    useEffect(() => {
        for (const col of allTableColumns) {
            col.toggleVisibility(visibleColumns.includes(col.id))
        }
    }, [allTableColumns, visibleColumns]);

    const setShowVisualizationDialog = useSetAtom($showVisualizationDialog);
    const currentEntitiesFields = entityType;
    const setCurrentEntitiesFields = useSetAtom($currentEntitiesFieldsAtom);

    useEffect(() => {
        setCurrentEntitiesFields(entityType);
    }, [entityType, setCurrentEntitiesFields]);

    const searchableEntityFields = useMemo(() => {
        return entityType.filter(it => it.type === 'string')
    }, [entityType])

    const [filterRequest, setFilterRequest] = useState<{ field: string, type: string |null } | null>(null)

    const addFilter = useCallback((fieldId: string) => {
        setFilterRequest({
            field: fieldId,
            type: null
        })
    }, [])
    const addSearch = useCallback((fieldId: string) => {
        setFilterRequest({
            field: fieldId,
            type: 'string_contains'
        })
    }, [])

    return (
        <div className={"flex w-full min-w-screen-sm flex-col"}>
            <div className="flex flex-justify-between gap-2 w-full py-2">
                {!(settings) || settings.enableSearch && (
                    <div className="flex gap-2 max-w-sm w-full">
                        <Input
                            placeholder={
                                (searchPosition.length !== 0)
                                    ? "Поиск по " + searchPosition?.join(", ")
                                    : "Выберите колонку для поиска"
                            }
                            value={filterString}
                            onChange={(event) => setFilterString(event.target.value)}
                            disabled={searchPosition.length === 0}
                            className=""
                        />
                        <MultiSelect
                            asChild
                            options={searchableEntityFields
                                .map(it => ({
                                    label: it.name,
                                    value: it.id
                                }))}
                            onValueChange={setSearchPosition}
                        >
                            <Button variant="outline">
                                <SettingsIcon/>
                            </Button>
                        </MultiSelect>
                    </div>
                )}

                <div className="flex justify-center items-center gap-2 ml-auto">
                    {buttonsSlot && buttonsSlot()}
                    <div>
                        {settings?.enableVisualization &&
                            <Button size="sm" onClick={() => {
                                setShowVisualizationDialog(true);
                            }}>
                                <ChartNetwork/> Визуализация
                            </Button>
                        }
                    </div>
                    <DataTableViewOptions allTableColumns={allTableColumns} setVisibleColumns={setVisibleColumns} visibleColumns={visibleColumns}/>
                </div>
            </div>

            <TableFilters table={table} filters={filters} setFilters={setFilters} fields={entityType} filterRequest={filterRequest} setFilterRequest={setFilterRequest} />

            <div className="rounded border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="truncate">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                {
                                                    ...header.getContext(),
                                                    entityField: (header.column.columnDef.meta.field && entityType.find(it => it.id === header.column.columnDef.meta.field)) ?? undefined,
                                                    addFilter: () => addFilter(header.column.columnDef.meta.field),
                                                    addSearch: () => addSearch(header.column.columnDef.meta.field),
                                                }
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>

                        <TableRow className={"border-none"}>
                            <TableCell colSpan={table.getAllColumns().length} className={"h-[4px] p-0"}>
                                {isPending && <ProgressDemo/>}
                            </TableCell>
                        </TableRow>

                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Загрузка...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="cursor-pointer truncate"
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={(e) => {
                                        const isCheckboxClick = (
                                            e.target as HTMLElement
                                        ).closest(".row-select-checkbox");
                                        if (!isCheckboxClick && settings.rowClickHandler) {
                                            settings.rowClickHandler(row.original);
                                        }
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="truncate">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Не найдено
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <DataTablePagination table={table} totalItems={data?.page?.totalElements}
                                     number={data?.page?.number}
                                     size={data?.page?.size} totalPages={data?.page?.totalPages}/>
            </div>

            <VisualizationDialog
                dataFields={currentEntitiesFields}
                queryURL={queryURLname as string}
                filters={filters}
                filterString={filterString}
                searchPosition={searchPosition}
            />
        </div>
    );
}

export default RichTableView
