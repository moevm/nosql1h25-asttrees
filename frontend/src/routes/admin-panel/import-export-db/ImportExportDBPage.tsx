import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

function ImportExportDBPage() {
    return (
        <div className={"p-8 flex flex-col gap-2"}>
            <Label className={"text-2xl"}>
                Импорт/Эксорт БД
            </Label>
            <div className={"flex flex-col gap-4"}>
                <div className={""}>
                    <Label className={"text-xl"}>Экспорт</Label>
                    <Button className={"my-2"}>Экспортировать</Button>
                </div>
                <div>
                    <Label className={"text-xl"}>Импорт</Label>
                    <div className={"flex justify-center items-center gap-2"}>
                        <Input type={"file"} accept={".zip"}></Input>
                        <Button className={"my-2"}>Экспортировать</Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ImportExportDBPage