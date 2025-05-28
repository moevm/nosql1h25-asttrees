import * as z from "zod";
import dayjs from "dayjs";

const date = () => z.preprocess(
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

const number = () => z.preprocess(
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
        .nonnegative("Ожидается неотрицательное число")
)

export const userSchema = z.object({
    username: z.string().min(1, "Обязательное поле").describe('Никнейм'),
    email: z.string().email("Некорректный email").describe('Email'),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).describe('Публичность'),
    createdAt: date().describe('Дата создания'),
    isAdmin: z.boolean().describe('Администратор'),
});

export const repoSchema = z.object({
    name: z.string().min(1, "Обязательное поле").describe('Название'),
    ownerId: z.string().min(1, "Обязательное поле").describe('ID владельца'),
    visibility: z.enum(["PUBLIC", "PRIVATE", "PROTECTED"]).describe('Публичность'),
    createdAt: date().describe('Дата создания'),
    originalLink: z.string().url().describe('Ссылка на оригинал'),
});

export const branchSchema = z.object({
    name: z.string().min(1, "Обязательное поле").describe('Название'),
    repoId: z.string().min(1, "Обязательное поле").describe('ID репозитория'),
    createdAt: date().describe('Дата создания'),
    isDefault: z.boolean().describe('Основная ветка')
});

export const astTreeSchema = z.object({
    createdAt: date().describe('Дата создания'),
});

export const astNodeSchema = z.object({
    type: z.string().describe('Тип'),
    label: z.string().describe('Значение'),
    tree: z.string().min(1, "Обязательное поле").describe('ID дерева'),
})

export const commitSchema = z.object({
    hash: z.string().min(1, "Обязательное поле").describe('Hash'),
    author: z.string().min(1, "Обязательное поле").describe('Автор'),
    email: z.string().email("Некорректный email").describe('Email автора'),
    message: z.string().min(1, "Обязательное поле").describe('Сообщение'),
    filesChanged: number().describe('Файлов изменено'),
    linesAdded: number().describe('Строк добавлено'),
    linesRemoved: number().describe('Строк удалено'),
    createdAt: date().describe('Дата создания'),
});

export const commitFileSchema = z.object({
    name: z.string().min(1, "Обязательное поле").describe('Имя файла'),
    fullPath: z.string().min(1, "Обязательное поле").describe('Полный путь'),
    // type: z.enum(['FILE', 'DIRECTORY']).describe('Тип'),
    hash: z.optional(z.string()).describe('Hash'),
    parent: z.optional(z.string()).describe('ID родителя'),
    commit: z.string().min(1, 'Обязательное поле').describe('ID коммита'),
    originalAuthor: z.string().min(1, "Обязательное поле").describe('Первый автор'),
    lastChangedBy: z.string().min(1, "Обязательное поле").describe('Последний изменивший'),
})

export const getInitialDate = (dateString?: string | null): string | undefined => {
    if (!dateString) return undefined;
    const djs = dayjs(dateString);
    if (!djs.isValid()) return undefined
    return djs.format('YYYY-MM-DDTHH:mm:ss')
};
