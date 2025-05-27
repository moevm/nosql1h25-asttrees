import {Button} from "@/components/ui/button.tsx";
import {Filter, X} from "lucide-react";
import * as React from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label.tsx";
import {type FilterConfiguration, type FilterItem, FILTERS, getFieldFilters} from "@/lib/filters.ts";
import type {EntityField} from "@/lib/utils.ts";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

interface FilterInitialState {
    kind: string | null,
    field: string,
    params: Record<string, unknown> | null
}

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
        editingFilter: FilterInitialState | null,
        save: (value: FilterItem) => void,
        fields: EntityField[]
    }) {

    const [selectFieldOpen, setSelectFieldOpen] = useState(false);
    const [selectRelationOpen, setSelectRelationOpen] = useState(false);
    const [fieldId, setFieldId] = useState<string | undefined>(() => {
        return editingFilter ? editingFilter.field : (fields.length > 0 ? fields[0].id : undefined);
    });
    const [availableFilters, setAvailableFilters] = useState<FilterConfiguration[]>([]);
    const [filterId, setFilterId] = useState<string | undefined>(() => {
        return editingFilter?.kind ?? undefined;
    });

    const isInitializingFromProps = useRef(false);
    const prevOpenEditFilterDialog = useRef(openEditFilterDialog);
    const prevEditingFilter = useRef(editingFilter);

    const field = useMemo<EntityField | undefined>(() => {
        if (!fieldId) return undefined;
        return fields.find(it => it.id === fieldId);
    }, [fieldId, fields]);

    const filter = useMemo<FilterConfiguration | undefined>(() => {
        if (!filterId) return undefined;
        return FILTERS.find(f => f.id === filterId);
    }, [filterId]);

    const schema = useMemo(() => {
        if (!filter || !filter.params || filter.params.length === 0) {
            return z.object({});
        }

        const shape: Record<string, z.ZodTypeAny> = {};
        filter.params.forEach(param => {
            let fieldSchema: z.ZodTypeAny;
            switch (param.type) {
                case "int":
                    fieldSchema = z.preprocess(
                        (arg: unknown) => (typeof arg === 'string' && arg.trim() === '') ? undefined : arg,
                        z.coerce.number({
                            required_error: "Обязательное поле",
                            invalid_type_error: "Обязательное поле",
                        }).int("Ожидается целое число")
                    );
                    break;
                case "string":
                    fieldSchema = z.string({
                        required_error: 'Обязательное поле'
                    }).min(1, 'Обязательное поле');
                    break;
                case "boolean":
                    fieldSchema = z.boolean().default(false);
                    break;
                case "date":
                    fieldSchema = z.preprocess(
                        (arg: unknown) => {
                            if (arg === '' || arg === null || arg === undefined) return undefined;
                            if (typeof arg === 'string' || arg instanceof Date) {
                                const date = new Date(arg as string | Date);
                                return isNaN(date.getTime()) ? undefined : date;
                            }
                            return undefined;
                        },
                        z.date({
                            required_error: "Обязательное поле",
                            invalid_type_error: "Некорректный формат даты",
                        })
                    );
                    break;
            }
            shape[param.id] = fieldSchema;
        });

        let baseSchema = z.object(shape);

        if (filter.validate) {
            baseSchema = baseSchema.superRefine((data, ctx) => {
                const validationMessage = filter.validate!(data);

                if (validationMessage) {
                    let errorPath: string[] = [];

                    if (errorPath.length === 0 && filter.params.length > 0) {
                        errorPath = [filter.params[0].id];
                    }

                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: validationMessage,
                        path: errorPath,
                    });
                }
            }) as unknown as z.ZodObject<any, any, any, any, any>;
        }
        return baseSchema;
    }, [filter]);

    const form = useForm({
        resolver: zodResolver(schema),
        reValidateMode: "onSubmit",
        mode: "all",
        defaultValues: {}
    });

    useEffect(() => {
        form.reset({}, {
            resolver: zodResolver(schema)
        });
    }, [schema, form]);

    useEffect(() => {
        if (field && field.type) {
            const newFilterIds = getFieldFilters(field.type);
            const newFilters = newFilterIds
                .map(id => FILTERS.find(f => f.id === id))
                .filter((f): f is FilterConfiguration => f !== undefined);
            setAvailableFilters(newFilters);
        } else {
            setAvailableFilters([]);
        }
    }, [field]);

    useEffect(() => {
        const dialogJustOpened = openEditFilterDialog && !prevOpenEditFilterDialog.current;
        const editingFilterItselfChanged = editingFilter !== prevEditingFilter.current;

        const editingFilterContentChanged = editingFilter && prevEditingFilter.current &&
            (editingFilter.field !== prevEditingFilter.current.field ||
                editingFilter.kind !== prevEditingFilter.current.kind ||
                JSON.stringify(editingFilter.params) !== JSON.stringify(prevEditingFilter.current.params));

        const needsReinitialization = openEditFilterDialog && (dialogJustOpened || editingFilterItselfChanged || editingFilterContentChanged);

        if (needsReinitialization) {
            isInitializingFromProps.current = true;

            if (editingFilter) {
                setFieldId(editingFilter.field);
                setFilterId(editingFilter.kind || undefined);
                if (editingFilter.params && Object.keys(editingFilter.params).length > 0) {
                    form.reset(editingFilter.params);
                } else {
                    form.reset({});
                }
            } else {
                if (fields.length > 0) {
                    setFieldId(fields[0].id);
                } else {
                    setFieldId(undefined);
                }
                setFilterId(undefined);
                form.reset({});
            }
        }

        prevOpenEditFilterDialog.current = openEditFilterDialog;
        prevEditingFilter.current = editingFilter;

        const timerId = setTimeout(() => {
            if (needsReinitialization) {
                isInitializingFromProps.current = false;
            }
        }, 0);

        return () => clearTimeout(timerId);

    }, [openEditFilterDialog, editingFilter, fields, form]);

    useEffect(() => {
        if (isInitializingFromProps.current) {
            return;
        }

        let newFilterIdToSet: string | undefined = filterId;
        let formNeedsResetToDefaults = false;

        if (fieldId && availableFilters.length > 0) {
            const currentFilterIdIsValidForAvailable = filterId && availableFilters.some(f => f.id === filterId);
            if (!currentFilterIdIsValidForAvailable) {
                newFilterIdToSet = availableFilters[0].id;
            }
        } else if (fieldId && availableFilters.length === 0 && filterId !== undefined) {
            newFilterIdToSet = undefined;
        }

        if (newFilterIdToSet !== filterId) {
            setFilterId(newFilterIdToSet);
            return;
        }

        if (filter && filter.params) {
            const isEditingOriginalFilterKind = editingFilter && filter.id === editingFilter.kind;
            let shouldReset = true;

            if (isEditingOriginalFilterKind) {
                const formValues = form.getValues();
                const editingParams = editingFilter?.params || {};
                const formMatchesEditingParams = Object.keys(editingParams).length > 0 &&
                    Object.keys(editingParams).every(key => editingParams[key] === formValues[key]) &&
                    filter.params.every(p => Object.prototype.hasOwnProperty.call(formValues, p.id));

                if (formMatchesEditingParams) {
                    shouldReset = false;
                }
            }

            if (shouldReset) {
                formNeedsResetToDefaults = true;
            }
        } else if (!filter && Object.keys(form.getValues()).length > 0) {
            form.reset({});
            return;
        }

        if (formNeedsResetToDefaults && filter && filter.params) {
            const defaultValues = {};
            filter.params.forEach(p => {
                switch (p.type) {
                    case "int":
                        defaultValues[p.id] = 0;
                        break;
                    case "string":
                        defaultValues[p.id] = '';
                        break;
                    case "boolean":
                        defaultValues[p.id] = false;
                        break;
                    case "date":
                        defaultValues[p.id] = '';
                        break;
                }
            });
            form.reset(defaultValues);
        } else if (!filter && Object.keys(form.getValues()).length > 0) {
            form.reset({});
        } else {
        }
    }, [
        fieldId,
        availableFilters,
        filterId,
        filter,
        editingFilter,
        form,
    ]);

    const handleSubmit = useCallback(() => {
        const currentValues = form.getValues();

        if (!filter || !filter.params || !field) {
            return;
        }

        const paramsToSave: Record<string, any> = {};
        filter.params.forEach(paramInfo => {
            paramsToSave[paramInfo.id] = currentValues[paramInfo.id];
        });

        save({
            params: paramsToSave,
            field: field.id,
            kind: filter.id
        });
        setOpenEditFilterDialog(false);
    }, [filter, field, form, save, setOpenEditFilterDialog]);

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
                    <Select value={fieldId} onValueChange={setFieldId} open={selectFieldOpen} onOpenChange={value => {
                        setSelectFieldOpen(value)
                        if (value) {
                            setSelectRelationOpen(false)
                        }
                    }}>
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
                    <Select value={filterId} onValueChange={setFilterId} open={selectRelationOpen}
                            onOpenChange={value => {
                                setSelectRelationOpen(value)
                                if (value) {
                                    setSelectFieldOpen(false)
                                }
                            }}>
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
                        {filter && filter.params.map(p =>
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
        fields,
        filterRequest,
        setFilterRequest
    }: {
        filters: FilterItem[],
        setFilters: (data: FilterItem[]) => void,
        fields: EntityField[],
        filterRequest: { field: string, type: string | null } | null,
        setFilterRequest: (value: { field: string, type: string | null } | null) => void
    }
) {
    // const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [openEditFilterDialog, setOpenEditFilterDialog] = useState(false);
    const [editingFilterIndex, setEditingFilterIndex] = useState<number | null>(null)
    const [activeFilterRequest, setActiveFilterRequest] = useState<{ field: string, type: string | null } | null>(null)

    const editingFilter = useMemo<FilterInitialState | null>(() => {
        if (editingFilterIndex !== null) {
            return filters[editingFilterIndex!]
        }
        if (activeFilterRequest != null) {
            return {
                kind: activeFilterRequest.type,
                field: activeFilterRequest.field,
                params: {}
            }
        }
        return null
    }, [filters, editingFilterIndex, activeFilterRequest])

    const addFilter = useCallback(() => {
        setOpenEditFilterDialog(true)
    }, [])

    useEffect(() => {
        if (filterRequest) {
            setFilterRequest(null)
            setActiveFilterRequest(filterRequest)
            setOpenEditFilterDialog(true)
        }
    }, [filterRequest]);

    return (
        <div className="flex flex-wrap gap-2 pb-2">
            <FilterDialog
                fields={fields}
                openEditFilterDialog={openEditFilterDialog}
                setOpenEditFilterDialog={(value) => {
                    if (!value) {
                        setOpenEditFilterDialog(false)
                        if (editingFilterIndex !== null) {
                            setEditingFilterIndex(null)
                        }
                        if (activeFilterRequest != null) {
                            setActiveFilterRequest(null)
                        }
                    }
                }}
                editingFilter={editingFilter}
                save={(filter) => {
                    if (editingFilterIndex === null) {
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
