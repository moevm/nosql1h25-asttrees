import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useAtomValue, useSetAtom} from "jotai/react";
import {$showVisualizationDialogAtom} from "@/store/store.ts";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import type {EntityField} from "@/lib/utils.ts";
import {useCallback, useState} from "react";
import HeatMap from "@/components/custom/HeatMap.tsx";
import {$api, defaultOnErrorHandler} from "@/api";
import {toast} from "sonner";

function useVisualiseQuery(queryURL: string) {
    return $api.useMutation('post', `/entities/${queryURL}/stats`, {
        onSuccess(data) {
            if (data) {
                toast.success('Вуаля!')
            }
        },
        onError: defaultOnErrorHandler
    })
}

function VisualizationDialog ({dataFields, queryURL}:  {dataFields: EntityField[], queryURL: string}) {

    const showDialog = useAtomValue($showVisualizationDialogAtom);
    const setShowDialog = useSetAtom($showVisualizationDialogAtom);

    const [atrX, setAtrX] = useState<string | null>(null);
    const [atrY, setAtrY] = useState<string | null>(null);
    const [heatmapData, setHeatmapData] = useState<{ xValue: string; yValue: string; count: number }[]>([]);


    console.log(dataFields)

    const {mutate, isPending} = useVisualiseQuery(queryURL);

    const handleVisualiseSubmit = useCallback(() => {
        mutate({
            body: {
                filter: [],
                xAxisField: atrX,
                yAxisField: atrY,
            }
        }, {
            onSuccess: (res) => {
                setHeatmapData(res.items);
            }
        });
    }, [atrX, atrY]);
    return (
        <div className={"w-fit"}>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Label>Построить график</Label>
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div className={"flex flex-col gap-2"}>
                        <div className={"flex justify-between items-center"}>
                            <div className={"flex justify-center items-center gap-2"}>
                                <div className={"flex flex-col items-center gap-1"}>
                                    <Label>Ось X</Label>
                                    <Select onValueChange={setAtrX}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Атрибут X"}></SelectValue>
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                {dataFields.map((item) =>
                                                    <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>

                                    </Select>
                                </div>

                                <div className={"flex flex-col items-center gap-1"}>
                                    <Label>Ось Y</Label>
                                    <Select onValueChange={setAtrY}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Атрибут Y"}></SelectValue>
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                {dataFields.map((item) =>
                                                    <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>

                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Button onClick={() => handleVisualiseSubmit()}>Визуализировать</Button>
                            </div>
                        </div>

                        <div>
                            {heatmapData.length > 0 && <HeatMap data={heatmapData}/>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default VisualizationDialog;