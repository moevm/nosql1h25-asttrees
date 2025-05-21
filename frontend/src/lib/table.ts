import type {ColumnDef, ColumnMeta, RowData} from "@tanstack/react-table";

export type ColumnType = 'string' | 'number' | 'list' | 'none'
export type TypedColumnDef<T extends RowData> = ColumnDef<T> & {
    meta: ColumnMeta<T, unknown> & { type: ColumnType, selectFromFile?: true }
}

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