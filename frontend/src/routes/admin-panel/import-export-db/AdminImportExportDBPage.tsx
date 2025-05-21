import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {$api, defaultOnErrorHandler} from "@/api";
import {toast} from "sonner";
import {useRef, useState} from "react";

export function useExportQuery() {
    return $api.useMutation('post', '/db/export', {
        parseAs: 'stream',
        async onSuccess(stream: ReadableStream) {
            if (!(stream instanceof ReadableStream)) {
                toast.error("Не удалось получить поток данных");
                return;
            }

            const reader = stream.getReader();
            const chunks = [];

            let done, value;
            while ({ done, value } = await reader.read(), !done) {
                chunks.push(value);
            }

            // Собираем blob из чанков
            const blob = new Blob(chunks, { type: 'application/zip' });

            // Создаем ссылку и скачиваем
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'export.zip';
            a.click();
            URL.revokeObjectURL(url);

            toast.success('Экспорт завершён, загрузка началась!');
        },
        onError: defaultOnErrorHandler
    });
}

export function useImportQuery() {
    return $api.useMutation('post', '/db/import', {
        onSuccess() {
            toast.success('Импорт завершён!');
        },
        onError: defaultOnErrorHandler
    });
}


function AdminImportExportDBPage() {

    const {mutate:mutateExport, isPending: isPendingExport} = useExportQuery()
    const {mutate:mutateImport, isPending: isPendingImport} = useImportQuery()
    const fileInputRef = useRef<HTMLInputElement>(null);

    function exportHandle() {
        mutateExport({
            parseAs: 'stream'
        });
    }

    async function importHandle() {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            toast.error("Пожалуйста, выберите файл для импорта");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        mutateImport({
            body: formData,
        });
    }


    return (
        <div className={"p-8 flex flex-col gap-2"}>
            <Label className={"text-2xl"}>
                Импорт/Эксорт БД
            </Label>
            <div className={"flex flex-col gap-4"}>
                <div>
                    <Label className={"text-xl"}>Экспорт</Label>
                    <Button className={"my-2"} onClick={() => exportHandle()} disabled={isPendingExport}>Экспортировать</Button>
                </div>
                <div>
                    <Label className={"text-xl"}>Импорт</Label>
                    <div className={"flex justify-center items-center gap-2"}>
                        <Input type={"file"} accept={".zip"} ref={fileInputRef}></Input>
                        <Button className={"my-2"} onClick={() => importHandle()} disabled={isPendingImport}>Импортировать</Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdminImportExportDBPage