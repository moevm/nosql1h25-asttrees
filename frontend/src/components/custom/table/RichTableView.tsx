import * as React from "react";
import type {ColumnDef, ColumnFiltersState, Row, SortingState, VisibilityState} from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import {ReactNode, useEffect} from "react";
import {Input} from "@/components/ui/input.tsx";
import {MultiSelect} from "@/components/custom/multi-select/MultiSelect.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CheckIcon, FileDown, FileUp, Filter, SettingsIcon} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {DataTablePagination} from "@/components/custom/table/DataTablePagination.tsx";
import {DataTableViewOptions} from "@/components/custom/table/DataTableViewOptions.tsx";
import {getColumnTypeRelations, relationFullName} from "@/lib/table.ts";

export interface ContextMenuConfig<TData> {
    getLabel?: (rows: Row<TData>[]) => string;
    items: (rows: Row<TData>[]) => React.ReactNode;
}

interface RichTableViewProps<TData, TValue> {
    entries: TData[]; // состояние с данными
    tableConfig: {
        columns: ColumnDef<TData, TValue>[];
        globalFilterFn?: any; // кастомный фильтр
    };
    settings?: {
        enableSearch?: boolean;
        enableExport?: boolean;
        enableImport?: boolean;
        // enableSelectFromFile?: boolean;
        enableColumnVisibilityToggle?: boolean;
        rowClickHandler?: (data: TData) => void;
    };
    onSelectionUpdated?: (data: Row<TData>[]) => void;
}

function Select(props: { children: ReactNode }) {
    return null;
}

function RichTableView<TData, TValue>({
                                          entries,
                                          tableConfig,
                                          settings = {},
                                          onSelectionUpdated
                                      }: RichTableViewProps<TData, TValue>) {
    console.info({
        entries: entries
    })
    const data = entries;

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [filterString, setFilterString] = React.useState<string>();
    const [searchPosition, setSearchPosition] = React.useState<string[]>([]);

    const [showDialogExport, setShowDialogExport] = React.useState<boolean>(false);
    const [showDialogImport, setShowDialogImport] = React.useState<boolean>(false);
    const [showDialogSelectFromFile, setShowDialogSelectFromFile] = React.useState<boolean>(false);

    const defaultGlobalFilter = (row, columnId, filterValue) => {
        return row.getValue(columnId)?.toString().toLowerCase().includes(filterValue.toLowerCase());
    };

    const table = useReactTable<TData>({
        data,
        columns: tableConfig.columns,
        state: {
            sorting,
            rowSelection,
            columnVisibility,
            columnFilters
        },
        onSortingChange: setSorting,
        onRowSelectionChange: data => {
            setRowSelection(data)
            setTimeout(() => {
                onSelectionUpdated?.(table.getSelectedRowModel().rows)
            }, 0)
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: tableConfig.globalFilterFn || defaultGlobalFilter
    });

    useEffect(() => {
        table.setGlobalFilter(filterString)
    }, [filterString, table, searchPosition]);


    return (
        <div className={"flex w-full max-w-screen-lg flex-col"}>

            <div className="flex flex-col gap-2 w-full py-2">
                {!(settings) || settings.enableSearch && (
                    <div className="flex gap-2">
                        <Input
                            placeholder={
                                searchPosition.length
                                    ? "Поиск по " + searchPosition.join(", ")
                                    : "Выберите колонку для поиска"
                            }
                            value={filterString}
                            onChange={(event) => setFilterString(event.target.value)}
                            disabled={searchPosition.length === 0}
                            className="max-w-sm"
                        />
                        <MultiSelect
                            asChild
                            options={table.getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide() &&
                                        column.columnDef.meta.type === 'string'
                                )
                                .map(it => ({
                                    label: it.columnDef.meta?.title || it.id,
                                    value: it.id
                                }))}
                            onValueChange={setSearchPosition}
                        >
                            <Button variant="outline">
                                <SettingsIcon/>
                            </Button>
                        </MultiSelect>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    <Filter/>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-80">
                                <div className="mb-4">
                                    <h4 className="font-medium leading-none">Фильтры</h4>
                                </div>

                                <div className="flex flex-col gap-2 justify-items-stretch">
                                    <Label htmlFor="width">Атрибут</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите атрибут"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {table
                                                    .getAllColumns()
                                                    .filter(
                                                        (column) =>
                                                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                                                    )
                                                    .map((column) => {
                                                        return (
                                                            <SelectItem
                                                                key={column.id}
                                                                value={column.id}>{column.columnDef.meta?.title ? column.columnDef.meta.title : column.id}</SelectItem>
                                                        )
                                                    })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Label htmlFor="width">Отношение</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите отношение"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {getColumnTypeRelations('number')
                                                    .map((relation) => {
                                                        return (
                                                            <SelectItem
                                                                key={relation}
                                                                value={relation}>{relationFullName[relation]}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Label htmlFor="width">Значение</Label>
                                    <Input
                                        //TODO закончить форму
                                        placeholder="gmail.com"
                                        onChange={
                                            (event) => {
                                            }
                                        }
                                        className="max-w-sm"
                                    />
                                    <Button variant="outline">Добавить фильтр</Button>
                                    <Button variant="outline">Очистить фильтры</Button>
                                    <Button variant="outline">Применить</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}


                <div className="flex justify-between">
                    <div className="flex gap-2">
                        {settings?.enableExport &&
                            <Button variant="outline" size="sm" onClick={() => setShowDialogExport(true)}>
                                <FileUp/> Экспорт
                            </Button>}
                        {settings?.enableImport &&
                            <Button variant="outline" size="sm" onClick={() => setShowDialogImport(true)}>
                                <FileDown/> Импорт
                            </Button>}
                        {/*settings?.enableSelectFromFile &&*/
                            <Button variant="outline" size="sm" onClick={() => setShowDialogSelectFromFile(true)}>
                                <CheckIcon/> Выделить из файла
                            </Button>}
                    </div>
                    {settings?.enableColumnVisibilityToggle && <DataTableViewOptions table={table}/>}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="truncate max-w-screen-lg">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className={"cursor-pointer truncate max-w-screen-lg"}
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    // TODO: проваливание здесь
                                    onClick={(e) => {
                                        const isCheckboxClick = (e.target as HTMLElement).closest('.row-select-checkbox');
                                        if (!isCheckboxClick && settings.rowClickHandler) {
                                            settings.rowClickHandler(row.original);
                                        }
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="truncate max-w-screen-lg">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={tableConfig.columns.length} className="h-24 text-center">
                                    Не найдено
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <DataTablePagination table={table}/>
            </div>

            {/*<ExportDialog*/}
            {/*    open={showDialogExport}*/}
            {/*    onOpenChange={setShowDialogExport}*/}
            {/*    table={table}*/}
            {/*    selectedCount={Object.keys(rowSelection).length}*/}
            {/*    data={entries}*/}
            {/*/>*/}
            {/*<FileDialog*/}
            {/*    open={showDialogSelectFromFile}*/}
            {/*    onOpenChange={setShowDialogSelectFromFile}*/}
            {/*    title={"Выделить из файла"}*/}
            {/*    description={"Будут выделены все строки с совпадениями основных полей"}*/}
            {/*    buttonText={"Выделить из файла"}*/}
            {/*    onSubmit={(data) => {*/}
            {/*        const matches = new Set(data.flatMap(it => Object.values(it).map(it => String(it).toLowerCase())))*/}
            {/*        console.info(matches)*/}

            {/*        const cols = table.getAllColumns()*/}
            {/*            .filter(*/}
            {/*                (column) =>*/}
            {/*                    column.columnDef.meta.selectFromFile === true*/}
            {/*            )*/}

            {/*        let count = 0*/}
            {/*        table.getRowModel().rows.forEach(row => {*/}
            {/*            if (cols.some(it => matches.has(String(row.getValue(it.id)).toLowerCase()))) {*/}
            {/*                row.toggleSelected(true)*/}
            {/*                count++*/}
            {/*            }*/}
            {/*        })*/}

            {/*        toast.success(`Выделено ${count} строк`)*/}
            {/*        return true*/}
            {/*    }}*/}
            {/*/>*/}
            {/*<UserImportDialog*/}
            {/*    open={showDialogImport}*/}
            {/*    onOpenChange={setShowDialogImport}*/}
            {/*/>*/}
        </div>
    );
}

export default RichTableView
