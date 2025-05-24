import {Button} from "@/components/ui/button.tsx";
import {Filter, X} from "lucide-react";
import * as React from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label.tsx";
import {type Table} from "@tanstack/react-table";
import {type FilterConfiguration, type FilterItem, FILTERS, getFieldFilters} from "@/lib/FILTERS.ts";
import type {EntityField} from "@/lib/utils.ts";
import {Select, SelectContent, SelectGroup, SelectItem, SelectValue, SelectTrigger} from "@/components/ui/select.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

function FilterDisplay(
    {
        filter,
        onEdit,
        onDelete,
        fields
    }: {
        filter: FilterItem,
        onEdit: () => void,
        onDelete: () => void,
        fields: EntityField[]
    }) {
    const values = useMemo(() => Object.entries(filter.params), [filter.params])

    return (
        <Button
            variant={"outline"}
            // className={"border-primary text-primary hover:text-primary bg-transparent hover:bg-primary/10 pr-3 gap-1"}
            onClick={onEdit}
        >
            <div className={"inline-flex gap-1"}>
                <span>{fields.find(it => it.id === filter.field)!.name}: </span>
                <span>{FILTERS.find(it => it.id === filter.kind)!.name}</span>
                {values.length && <span>{
                    (
                        values.length === 1
                            ? String(values[0][1])
                            : values.map(([k, v]) => `${v}`).join(', ')
                    )
                }</span> || false}
            </div>
            <Button
                variant="ghost"
                className={"text-primary hover:text-background hover:bg-destructive !p-1 bg-transparent h-auto"}
                onClick={e => {
                    onDelete()
                    e.stopPropagation()
                }}
            >
                <X/>
            </Button>
        </Button>
    )
}

function FilterDialog(
    {
        openEditFilterDialog,
        setOpenEditFilterDialog,
        editingFilter,
        save,
        fields
    }: {
        openEditFilterDialog: boolean,
        setOpenEditFilterDialog: (value: boolean) => void,
        editingFilter: FilterItem | null,
        save: (value: FilterItem) => void,
        fields: EntityField[]
    }) {

    const [fieldId, setFieldId] = useState<string>()
    const [availableFilters, setAvailableFilters] = useState<FilterConfiguration[]>([])
    const [filterId, setFilterId] = useState<string>()
    const [editingFilterChecked, setEditingFilterChecked] = useState<boolean>()
    // const [formAppliedAfterEditingFilterChecked, setFormAppliedAfterEditingFilterChecked] = useState<boolean>()

    useEffect(() => {
        if (openEditFilterDialog) {
            setFieldId(fields[0].id)
        }
    }, [fields, openEditFilterDialog]);

    const field = useMemo(() => {
        return fields.find(it => it.id === fieldId)!
    }, [fieldId])

    useEffect(() => {
        if (field) {
            const newFilters = getFieldFilters(field.type).map(id => FILTERS.find(f => f.id === id)!)
            console.info({
                newFilters
            })
            setAvailableFilters(newFilters)
        }
    }, [field]);

    useEffect(() => {
        availableFilters.length && setFilterId(availableFilters[0].id)
    }, [availableFilters]);

    const filter = useMemo(() => {
        if (filterId) {
            return FILTERS.find(f => f.id === filterId)!
        } else {
            return FILTERS.find(f => f.id === 'value_not_null')!
        }
    }, [filterId])

    const schema = useMemo(() => {
        return z.object(Object.fromEntries(filter.params.map(param => {
            let type;
            switch (param.type) {
                case "int":
                    type = z.preprocess(
                        (arg) => {
                            if (typeof arg === 'string' && arg.trim() === '') {
                                return undefined;
                            }
                            return arg;
                        },
                        z.coerce.number({
                            required_error: "Обязательное поле",
                            invalid_type_error: "Обязательное поле",
                        })
                            .int("Ожидается целое число")
                    )
                    break
                case "string":
                    type = z.string({
                        required_error: 'Обязательное поле'
                    }).min(1, 'Обязательное поле')
                    break;
                case "boolean":
                    type = z.boolean()
                    break;
                case "date":
                    type = z.preprocess(
                        (arg) => {
                            if (typeof arg === 'string' || arg instanceof Date) {
                                const date = new Date(arg);
                                return isNaN(date.getTime()) ? undefined : date;
                            }
                            return undefined;
                        },
                        z.date({
                            required_error: "Обязательное поле",
                            invalid_type_error: "Некорректный формат даты",
                        })
                    )
                    break;

            }
            return [param.id, type]
        })))
    }, [JSON.stringify(filter.params)])

    const form = useForm({
        context: {
            schema
        },
        reValidateMode: "onSubmit",
        mode: "all",
        resolver: (...opts) => {
            return zodResolver(opts[1].schema)(...opts)
        }
    })

    useEffect(() => {
        if (editingFilter && filter.id === editingFilter.kind) {
            return
        }

        form.reset(Object.fromEntries(
            filter.params.map(p => {
                let value;
                switch (p.type) {
                    case "int":
                        value = 0;
                        break
                    case "string":
                        value = '';
                        break
                    case "boolean":
                        value = false;
                        break
                    case "date":
                        value = ''
                        break
                }
                return [p.id, value]
            })
        ))
    }, [JSON.stringify(filter.params), editingFilter]);

    useEffect(() => {
        if (editingFilter) {
            if (!editingFilterChecked) {
                setFieldId(editingFilter.field)
                setFilterId(editingFilter.kind)
                form.reset(editingFilter.params)

                setEditingFilterChecked(true)
                // setFormAppliedAfterEditingFilterChecked(false)
            }
        } else {
            if (editingFilterChecked) {
                setEditingFilterChecked(false)
                // setFormAppliedAfterEditingFilterChecked(false)
            }
        }
    }, [editingFilter, editingFilterChecked]);

    const handleSubmit = useCallback(() => {
        const params = Object.fromEntries(Object.entries(form.getValues())
            .filter(([k,]) => filter.params.find(it => it.id === k))
            .map(([k, v]) => {
                return [k, v]
            }))
        save({
            params,
            field: field.id,
            kind: filter.id
        })
        setOpenEditFilterDialog(false)
    }, [filter])

    return (
        <Dialog open={openEditFilterDialog} onOpenChange={setOpenEditFilterDialog}>
            <DialogContent className={"max-w-sm"}>
                <DialogHeader>
                    <DialogTitle>
                        {editingFilter ? 'Изменить фильтр' : 'Добавить фильтр'}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <Label>Атрибут</Label>
                    <Select value={fieldId} onValueChange={setFieldId}>
                        <SelectTrigger className={"w-full"}>
                            <SelectValue placeholder="Выберите атрибут"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {fields
                                    .map((column) => {
                                        return (
                                            <SelectItem
                                                key={column.id}
                                                value={column.id}>{column.name}</SelectItem>
                                        )
                                    })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Label>Отношение</Label>
                    <Select value={filterId} onValueChange={setFilterId}>
                        <SelectTrigger className={"w-full"}>
                            <SelectValue placeholder="Выберите отношение"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {availableFilters
                                    .map((relation) => {
                                        return (
                                            <SelectItem
                                                key={relation.id}
                                                value={relation.id}>{relation.name}</SelectItem>
                                        )
                                    })
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Form {...form}>
                        {filter!.params.map(p =>
                            <FormField
                                key={p.id}
                                control={form.control}
                                name={p.id}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>{p.name}</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                   type={p.type === 'date' && 'datetime-local' || undefined}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}
                    </Form>
                </div>
                <DialogFooter>
                    <Button className={"w-full"} onClick={form.handleSubmit(handleSubmit)}>
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function TableFilters(
    {
        filters,
        setFilters,
        fields
    }: {
        filters: FilterItem[],
        setFilters: (data: FilterItem[]) => void,
        fields: EntityField[]
    }
) {
    // const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [openEditFilterDialog, setOpenEditFilterDialog] = useState(false);
    const [editingFilterIndex, setEditingFilterIndex] = useState<number | null>(null)

    const editingFilter = useMemo(() => {
        return ((editingFilterIndex !== null) && filters[editingFilterIndex!]) || null
    }, [filters, editingFilterIndex])

    const addFilter = useCallback(() => {
        setOpenEditFilterDialog(true)
    }, [])

    return (
        <div className="flex flex-wrap gap-2 pb-2">
            <FilterDialog
                fields={fields}
                openEditFilterDialog={openEditFilterDialog}
                setOpenEditFilterDialog={(value) => {
                    setOpenEditFilterDialog(false)
                    if (!value && editingFilter !== null) {
                        setEditingFilterIndex(null)
                    }
                }}
                editingFilter={editingFilter}
                save={(filter) => {
                    if (editingFilter === null) {
                        setFilters([...filters, filter]);
                    } else {
                        setFilters(filters.map((f, i) => {
                            if (i === editingFilterIndex) {
                                return filter
                            } else {
                                return f
                            }
                        }))
                    }
                }}
            />
            <Button variant="outline" onClick={() => addFilter()}>
                <Filter/>
                Добавить фильтр
            </Button>
            {filters.map(((filter, i) => (
                <FilterDisplay
                    key={i}
                    fields={fields}
                    filter={filter}
                    onEdit={() => {
                        setEditingFilterIndex(i)
                        setOpenEditFilterDialog(true)
                    }}
                    onDelete={() => {
                        setFilters(filters.filter((_, index) => {
                            return index !== i
                        }))
                    }}
                />
            )))}
        </div>
    )
}

export default TableFilters
