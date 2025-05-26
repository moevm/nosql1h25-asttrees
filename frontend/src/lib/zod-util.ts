import {type ZodTypeAny, ZodString, ZodNumber, ZodBoolean, ZodEnum, ZodDate, ZodOptional, ZodNullable, ZodEffects } from 'zod';

export type ZodFieldType = 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'unknown';

export interface ZodFieldInfo {
    type: ZodFieldType;
    options?: string[];
    description?: string | null;
}

export function getZodFieldInfo(zodType: ZodTypeAny): ZodFieldInfo {
    let currentType = zodType;
    let description = currentType.description || null;

    while (
        currentType instanceof ZodOptional ||
        currentType instanceof ZodNullable ||
        currentType instanceof ZodEffects
        ) {
        if (currentType.description && !description) description = currentType.description;
        currentType = currentType instanceof ZodEffects
            ? currentType._def.schema
            : currentType._def.innerType;
    }
    if (currentType.description && !description) description = currentType.description;


    if (currentType instanceof ZodString) {
        return { type: 'string', description };
    }
    if (currentType instanceof ZodNumber) {
        return { type: 'number', description };
    }
    if (currentType instanceof ZodBoolean) {
        return { type: 'boolean', description };
    }
    if (currentType instanceof ZodEnum) {
        return { type: 'enum', options: currentType._def.values, description };
    }
    if (currentType instanceof ZodDate) {
        return { type: 'date', description };
    }
    return { type: 'unknown', description };
}
