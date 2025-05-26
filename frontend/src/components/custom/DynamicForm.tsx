import {z, ZodObject, type ZodTypeAny} from "zod";
import {type Path, useForm, type UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {getZodFieldInfo} from "@/lib/zod-util.ts";
import React from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {FieldRenderer} from "@/components/custom/FieldRenderer.tsx";
import {Button} from "@/components/ui/button.tsx";

interface DynamicFormProps<T extends ZodObject<any, any, any>> {
    schema: T;
    onSubmit: (data: z.infer<T>) => void;
    defaultValues?: Partial<z.infer<T>>;
    isLoading?: boolean;
    submitButtonText?: string;
    customFieldRenderers?: Partial<Record<keyof z.infer<T>, (form: UseFormReturn<z.infer<T>>, fieldName: keyof z.infer<T>) => React.ReactNode>>;
}

export function DynamicForm<T extends ZodObject<any, any, any>>(
    {
        schema,
        onSubmit,
        defaultValues,
        isLoading,
        submitButtonText = "Сохранить",
        customFieldRenderers = {}
    }: DynamicFormProps<T>) {
    type FormData = z.infer<T>;
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as any,
    });

    const fieldNames = Object.keys(schema.shape) as Array<keyof FormData>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {fieldNames.map((fieldName) => {
                    // Check for custom renderer first
                    if (customFieldRenderers && customFieldRenderers[fieldName]) {
                        return (
                            <div key={fieldName as string}>
                                {customFieldRenderers[fieldName]!(form, fieldName)}
                            </div>
                        );
                    }

                    const fieldSchema = schema.shape[fieldName as string] as ZodTypeAny;
                    const fieldInfo = getZodFieldInfo(fieldSchema);
                    const label = fieldInfo.description || (fieldName as string).charAt(0).toUpperCase() + (fieldName as string).slice(1);

                    // Special handling for boolean (checkbox) to place label correctly
                    if (fieldInfo.type === 'boolean') {
                        return (
                            <FormField
                                control={form.control}
                                name={fieldName as Path<FormData>}
                                key={fieldName as string}
                                render={({field}) => (
                                    <FormItem>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}/>
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {label}
                                            </label>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        );
                    }

                    return (
                        <FormField
                            control={form.control}
                            name={fieldName as Path<FormData>}
                            key={fieldName as string}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <FieldRenderer field={field} fieldInfo={fieldInfo}
                                                       fieldName={fieldName as string}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    );
                })}
                <Button type="submit" disabled={isLoading} className={"w-full"}>
                    {isLoading ? "Загрузка..." : submitButtonText}
                </Button>
            </form>
        </Form>
    );
}
