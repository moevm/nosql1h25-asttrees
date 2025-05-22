import * as z from "zod";

export const userSchema = z.object({
    username: z.string().min(1, "Обязательное поле"),
    email: z.string().email("Некорректный email"),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    createdAt: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) {
                const date = new Date(arg);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        },
        z.date({
            required_error: "Дата создания обязательна",
            invalid_type_error: "Некорректный формат даты",
        })
    ),
    isAdmin: z.boolean(),
});

export const astTreeSchema = z.object({
    depth: z.preprocess(
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
            .nonnegative("Ожидается положительное число")
    ),
    size: z.preprocess(
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
            .nonnegative("Ожидается положительное число")
    ),
    commitFileId: z.string().min(1, "Обязательное поле"),
    createdAt: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) {
                const date = new Date(arg);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        },
        z.date({
            required_error: "Дата создания обязательна",
            invalid_type_error: "Некорректный формат даты",
        })
    ),
});

export const branchSchema = z.object({
    name: z.string().min(1, "Обязательное поле"),
    repoId: z.string().min(1, "Обязательное поле"),
    createdAt: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) {
                const date = new Date(arg);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        },
        z.date({
            required_error: "Дата создания обязательна",
            invalid_type_error: "Некорректный формат даты",
        })
    ),
    isDefault: z.boolean()
});

export const commitSchema = z.object({
    hash: z.string().min(1, "Обязательное поле"),
    author: z.string().min(1, "Обязательное поле"),
    email: z.string().email("Некорректный email"),
    message: z.string().min(1, "Обязательное поле"),
    filesChanged: z.preprocess(
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
            .nonnegative("Ожидается положительное число")
    ),
    linesAdded: z.preprocess(
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
            .nonnegative("Ожидается положительное число")
    ),
    linesRemoved: z.preprocess(
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
            .nonnegative("Ожидается положительное число")
    ),
    createdAt: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) {
                const date = new Date(arg);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        },
        z.date({
            required_error: "Дата создания обязательна",
            invalid_type_error: "Некорректный формат даты",
        })
    ),
});

export const repoSchema = z.object({
    name: z.string().min(1, "Обязательное поле"),
    ownerId: z.string().min(1, "Обязательное поле"),
    visibility: z.enum(["PUBLIC", "PRIVATE", "PROTECTED"]),
    createdAt: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) {
                const date = new Date(arg);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        },
        z.date({
            required_error: "Дата создания обязательна",
            invalid_type_error: "Некорректный формат даты",
        })
    ),
    originalLink: z.string().url(),
});

export const getInitialDate = (dateString?: string | null): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
};