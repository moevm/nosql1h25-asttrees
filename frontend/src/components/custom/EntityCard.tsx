import {Card, CardContent} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {ReactNode} from "react";
import type {TypedColumnDef} from "@/lib/table.ts";
import {OptRenderer} from "@/components/custom/utils/ValueRenderers.tsx";

const getValue = (obj, key) => {
    const keys = key.split(".");
    let value = obj;
    for (let i = 0; i < keys.length; i++) {
        value = value[keys[i]];
        if (!value) {
            break;
        }
    }
    return value;
};

function EntityCard<T>(
    {
        entity,
        columns
    }: {
        entity: any,
        columns: TypedColumnDef<T>[]
    }) {
    return (
        <Card>
            <CardContent className="grid grid-cols-2 gap-y-2 gap-x-8 py-0" style={{'gridTemplateColumns': 'auto 1fr'}}>
                {
                    columns
                        .filter(it => it.accessorKey || it.accessorFn)
                        .map(col => (
                            <>
                                <Label className={""}>{col.meta.title}</Label>
                                <Label className={"select-all"}>{
                                    (col.cell ?? (({cell}) => <OptRenderer value={cell.getValue()} />))({
                                        cell: {
                                            getValue() {
                                                return col.accessorFn
                                                    ? col.accessorFn(entity)
                                                    : getValue(entity, col.accessorKey)
                                            }
                                        }
                                    })
                                }</Label>
                            </>
                        ))
                }

                {/*{props.items.map(item => (*/}
                {/*    <>*/}

                {/*    </>*/}
                {/*))}*/}

            </CardContent>
        </Card>
    )
}

export default EntityCard;
