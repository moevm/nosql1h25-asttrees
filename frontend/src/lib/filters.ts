import type {EntityField} from "@/lib/utils.ts";
import dayjs from "dayjs";

export interface FilterParam {
    id: string,
    name: string
    type: 'int' | 'string' | 'boolean' | 'date'
}

export interface FilterConfiguration {
    id: string
    name: string
    params: FilterParam[],
    validate?: (params: Record<string, unknown>) => string | null
}

export interface FilterItem {
    kind: string,
    field: string,
    params: Record<string, unknown>
}

export const FILTERS: FilterConfiguration[] = [
    {
        id: "int_equals",
        name: "Число равно",
        params: [
            {id: "value", name: "Значение", type: "int"}
        ]
    },
    {
        id: "int_not_equals",
        name: "Число не равно",
        params: [
            {id: "value", name: "Значение", type: "int"}
        ]
    },
    {
        id: "int_ge",
        name: "Число больше или равно",
        params: [
            {id: "value", name: "Значение", type: "int"}
        ]
    },
    {
        id: "int_gt",
        name: "Число больше",
        params: [
            {id: "value", name: "Значение", type: "int"}
        ]
    },
    {
        id: "int_le",
        name: "Число меньше или равно",
        params: [
            {id: "value", name: "Значение", type: "int"}
        ]
    },
    {
        id: "int_lt",
        name: "Число меньше",
        params: [
            {id: "value", name: "Значение", type: "int"}
        ]
    },
    // {
    //     id: "int_any_of",
    //     name: "Число любое из",
    //     params: [
    //         { id: "value", name: "string", type: "int" }
    //     ]
    // },
    {
        id: "int_between",
        name: "Число между",
        params: [
            {id: "from", name: "От", type: "int"},
            {id: "to", name: "До", type: "int"}
        ],
        validate: ({from, to}: { from: number, to: number }) => {
            if (!from || !to) {
                return null;
            }

            return (from < to) ? null : 'Число "От" должно быть меньше числа "До".';
        }
    },
    {
        id: "date_ge",
        name: "Дата больше или равна",
        params: [
            {id: "value", name: "Значение", type: "date"}
        ]
    },
    {
        id: "date_gt",
        name: "Дата больше",
        params: [
            {id: "value", name: "Значение", type: "date"}
        ]
    },
    {
        id: "date_le",
        name: "Дата меньше или равна",
        params: [
            {id: "value", name: "Значение", type: "date"}
        ]
    },
    {
        id: "date_lt",
        name: "Дата меньше",
        params: [
            {id: "value", name: "Значение", type: "date"}
        ]
    },
    // {
    //     id: "int_any_of",
    //     name: "Число любое из",
    //     params: [
    //         { id: "value", name: "string", type: "int" }
    //     ]
    // },
    {
        id: "date_between",
        name: "Дата между",
        params: [
            {id: "from", name: "От", type: "date"},
            {id: "to", name: "До", type: "date"}
        ],
        validate: ({from, to}: { from: Date, to: Date }) => {
            if (!from || !to) {
                return null;
            }

            const fromDayjs = dayjs(from);
            const toDayjs = dayjs(to);

            if (!fromDayjs.isValid() || !toDayjs.isValid()) {
                return "Одна из дат имеет неверный формат после обработки.";
            }

            return fromDayjs.isBefore(toDayjs) ? null : 'Дата "От" должна быть раньше даты "До".';
        }
    },
    {
        id: "string_equals",
        name: "Строка равна",
        params: [
            {id: "value", name: "Значение", type: "string"}
        ]
    },
    {
        id: "string_not_equals",
        name: "Строка не равна",
        params: [
            {id: "value", name: "Значение", type: "string"}
        ]
    },
    {
        id: "string_contains",
        name: "Строка содержит",
        params: [
            {id: "value", name: "Значение", type: "string"}
        ]
    },
    {
        id: "string_not_contains",
        name: "Строка не содержит",
        params: [
            {id: "value", name: "Значение", type: "string"}
        ]
    },
    // {
    //     id: "string_any_of",
    //     name: "Строка любая из",
    //     params: [
    //         { id: "value", name: "string", type: "string" }
    //     ]
    // },
    // {
    //     id: "string_not_any_of",
    //     name: "Строка не из списка", // Or "Строка не любая из"
    //     params: [
    //         { id: "value", name: "string", type: "string" }
    //     ]
    // },
    {
        id: "boolean_true",
        name: "Истина", // Or simply "Истина"
        params: []
    },
    {
        id: "boolean_false",
        name: "Ложь", // Or simply "Ложь"
        params: []
    },
    {
        id: "value_not_null",
        name: "Значение не пусто", // Or "Значение задано"
        params: []
    },
    {
        id: "value_null",
        name: "Значение пусто", // Or "Значение не задано"
        params: []
    },
    {
        id: 'list_contains_string',
        name: 'Список содержит',
        params: [
            {id: "value", name: "Значение", type: "string"}
        ]
    }
] as const;

export function getFieldFilters(
    fieldType: EntityField['type']
): string[] {
    const baseFilters = []
    switch (fieldType) {
        case "int":
            baseFilters.push(...[
                'int_equals',
                'int_not_equals',
                'int_ge',
                'int_gt',
                'int_le',
                'int_lt',
                'int_between',
            ])
            break
        case "string":
            baseFilters.push(...[
                'string_equals',
                'string_not_equals',
                'string_contains',
                'string_not_contains',
                // 'string_any_of',
                // 'string_not_any_of',
            ])
            break;
        case "boolean":
            baseFilters.push(...[
                'boolean_true',
                'boolean_false',
            ])
            break;
        case "date":
            baseFilters.push(...[
                'date_ge',
                'date_gt',
                'date_le',
                'date_lt',
                'date_between',
            ])
            break;
        case "list":
            baseFilters.push(...[
                'list_contains_string',
            ])
    }

    return [
        ...baseFilters,
        'value_null',
        'value_not_null',
    ]
}
