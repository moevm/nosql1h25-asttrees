import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {X} from "lucide-react";

interface ListLinkerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string[];
    onSave: (values: string[]) => void;
}

export function ListLinker(
    {
        open,
        setOpen,
        initialValue,
        onSave,
    }: ListLinkerProps) {
    const [currentValues, setCurrentValues] = useState<string[]>(initialValue);
    const [newValueName, setNewValueName] = useState<string>('');

    useEffect(() => {
        setCurrentValues(initialValue);
    }, [initialValue, open]);

    const handleAddValue = () => {
        if (newValueName.trim() && !currentValues.includes(newValueName.trim())) {
            setCurrentValues([...currentValues, newValueName.trim()]);
            setNewValueName('');
        } else if (currentValues.includes(newValueName.trim())) {
            setNewValueName('');
        }
    };

    const handleRemoveValue = (valueToRemove: string) => {
        setCurrentValues(currentValues.filter(value => value !== valueToRemove));
    };

    const handleSave = () => {
        onSave(currentValues);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddValue();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md flex flex-col">
                <DialogHeader>
                    <DialogTitle>Привязка сущностей</DialogTitle>
                </DialogHeader>

                <div className="flex-grow py-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="newValueName" className="mb-1 block text-sm font-medium">
                                Добавить сущность
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="newValueName"
                                    value={newValueName}
                                    onChange={(e) => setNewValueName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-grow"
                                />
                                <Button onClick={handleAddValue} type="button" disabled={!newValueName.trim()}>
                                    Добавить
                                </Button>
                            </div>
                        </div>

                        {currentValues.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Привязанные сущности:</Label>
                                <div
                                    className="w-full rounded-md border p-3 max-h-[50vh] overflow-y-auto">
                                    {currentValues.map((value, index) => (
                                        <div
                                            key={`${value}-${index}`}
                                            className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                                        >
                                            <span className="text-sm truncate" title={value}>{value}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveValue(value)}
                                                className="h-7 w-7"
                                            >
                                                <X className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentValues.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Нет привязанных сущностей
                            </p>
                        )}
                    </div>
                </div>


                <DialogFooter className="mt-auto">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleSave}>
                        Сохранить привязки
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
