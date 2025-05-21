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
import {Filter, GitGraph, SettingsIcon} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {DataTablePagination} from "@/components/custom/table/DataTablePagination.tsx";
import {DataTableViewOptions} from "@/components/custom/table/DataTableViewOptions.tsx";
import {getColumnTypeRelations, relationFullName} from "@/lib/table.ts";
import {useAtomValue, useSetAtom} from "jotai/react";
import {$currentEntitiesFieldsAtom, $currentUser, $showVisualizationDialogAtom} from "@/store/store.ts";
import VisualizationDialog from "@/components/dialogs/VisualizationDialog.tsx";
import type {EntityField} from "@/lib/utils.ts";

interface RichTableViewProps<TData, TValue> {
    table: ReturnType<typeof useReactTable<TData>>;
    isLoading?: boolean;
    entityType?: EntityField[];
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
    filterString?: string;
    setFilterString?: (value: string) => void;
    searchPosition?: string[];
    setSearchPosition?: (value: string[]) => void;
}

function RichTableView<TData, TValue>({
    table,
    isLoading,
    entityType,
    data = {},
    settings = {},
    filterString = "",
    setFilterString = () => {},
    searchPosition = [],
    setSearchPosition = () => {}
}: RichTableViewProps<TData, TValue>) {

    const defaultGlobalFilter = (row, columnId, filterValue) => {
        return row.getValue(columnId)?.toString().toLowerCase().includes(filterValue.toLowerCase());
    };

    console.log(data)
    console.log(data?.page)

    const setShowVisualizationDialog = useSetAtom($showVisualizationDialogAtom);
    const currentEntitiesFields = useAtomValue($currentEntitiesFieldsAtom);
    const setCurrentEntitiesFields = useSetAtom($currentEntitiesFieldsAtom);
    setCurrentEntitiesFields(entityType);


    return (
        <div className={"flex w-full min-w-screen-sm max-w-screen-lg flex-col"}>

            <div className="flex flex-justify-between gap-2 w-full py-2">
                {!(settings) || settings.enableSearch && (
                    <div className="flex gap-2 max-w-sm w-full">
                        <Input
                            placeholder={
                                !(searchPosition) || searchPosition.length
                                    ? "Поиск по " + searchPosition?.join(", ")
                                    : "Выберите колонку для поиска"
                            }
                            value={filterString}
                            onChange={(event) => setFilterString(event.target.value)}
                            disabled={searchPosition?.length === 0}
                            className=""
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

                <div className="flex justify-center items-center gap-2 ml-auto">
                    <div>
                        {settings?.enableVisualization &&
                            <Button size="sm" onClick={() => {
                                setShowVisualizationDialog(true);
                            }}>
                                <GitGraph/> Визуализация
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Загрузка...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="cursor-pointer truncate max-w-screen-lg"
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
                                        <TableCell key={cell.id} className="truncate max-w-screen-lg">
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
                <DataTablePagination table={table} totalItems={data?.page?.totalElements} number={data?.page?.number} size={data?.page?.size} totalPages={data?.page?.totalPages}/>
            </div>

            <VisualizationDialog dataFields={currentEntitiesFields} />
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
