import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";

function EntitySelector(
    {
        entities,
        open,
        setOpen,
        onSubmit,
        title
    }: {
        entities: string[],
        open: boolean,
        setOpen: (value: boolean) => void
        onSubmit: (value: string) => void
        title: string
    }
) {
    const [selectedEntity, setSelectedEntity] = useState(() => entities[0])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <Select
                    value={selectedEntity}
                    onValueChange={setSelectedEntity}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Ветка</SelectLabel>
                            {entities.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button onClick={() => {
                    onSubmit(selectedEntity)
                }}>Выбрать</Button>
            </DialogContent>
        </Dialog>
    )
}

export default EntitySelector
