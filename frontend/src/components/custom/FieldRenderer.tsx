import React from 'react';
import {type ControllerRenderProps, type FieldValues} from 'react-hook-form';
import {Input} from '@/components/ui/input'; // Your ShadCN UI imports
import {Checkbox} from '@/components/ui/checkbox';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {type ZodFieldInfo} from '@/lib/zod-util';
import {FormControl} from "@/components/ui/form.tsx";

interface FieldRendererProps<TFieldValues extends FieldValues = FieldValues, TName extends keyof TFieldValues = keyof TFieldValues> {
    field: ControllerRenderProps<TFieldValues, TName extends string ? TName : never>;
    fieldInfo: ZodFieldInfo;
    fieldName: string;
}

export function FieldRenderer<TFieldValues extends FieldValues = FieldValues, TName extends keyof TFieldValues = keyof TFieldValues>(
    {
        field,
        fieldInfo,
        fieldName
    }: FieldRendererProps<TFieldValues, TName>) {
    const placeholder = fieldInfo.description || fieldName;

    switch (fieldInfo.type) {
        case 'string':
            return <Input placeholder={placeholder} {...field} />;
        case 'number':
            return <Input type="number" placeholder={placeholder} {...field} />;
        case 'boolean':
            return (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={fieldName}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                </div>
            );
        case 'date':
            return (
                <Input
                    type="datetime-local"
                    {...field}
                />
            );
        case 'enum':
            if (!fieldInfo.options) return <Input placeholder="Unknown enum" disabled/>;
            return (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className={"w-full"}>
                            <SelectValue
                                placeholder={`Выберите ${fieldInfo.description?.toLowerCase() || 'значение'}`}/>
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {fieldInfo.options.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        default:
            return <Input placeholder={`Неизвестный тип поля: ${fieldName}`} disabled/>;
    }
}
