import type {ColumnDef, ColumnMeta, RowData} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";


export type ColumnType = 'string' | 'number' | 'list' | 'none'
export type TypedColumnDef<T extends RowData> = ColumnDef<T> & { meta: ColumnMeta<T, unknown> & { type: ColumnType, selectFromFile?: true } }


export const getColumnTypeRelations: (type: ColumnType) => string[] = type => {
    switch (type) {
        case 'string':
            return ['includes', 'not-includes', 'equals', 'not-equals']
        case 'number':
            return ['eq', 'not-eq', 'gt', 'lt', 'ge', 'le']
        case 'list':
            return []
        default:
            return []
    }
}


export const relationFullName = {
    'includes': "включает",
    'not-includes': "не включает",
    'equals': "соответствует",
    'not-equals': "не соответствует",
    'eq': "равно",
    'not-eq': "не равно",
    'gt': "больше, чем",
    'lt': "меньше, чем",
    'ge': "больше или равно",
    'le': "меньше или равно"
}

const typesUserType = {
    'bot': "Бот",
    'user': "Пользователь"
}


const customSortingFn = (rowA, rowB, columnId) => {
    const getValue = (row) => {
        const value = row.getValue(columnId);
        if (value === undefined || value === null) return "";
        return String(value);
    };

    const a = getValue(rowA);
    const b = getValue(rowB);

    if (a === b) return 0;
    if (a === "+" || a === "-") return 1;
    if (b === "+" || b === "-") return -1;

    return a.localeCompare(b, "ru", {numeric: true});
};

export const columnsUsers = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Выбрать всё"
            />
        ),
    }
]