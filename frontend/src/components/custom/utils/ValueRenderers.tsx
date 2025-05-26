import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Dayjs} from "dayjs";
import {Button} from "@/components/ui/button.tsx";
import {ExternalLink} from "lucide-react";
import {useNavigate} from "react-router-dom";

function MissingValue() {
    return <span className={"text-foreground/70"}>–</span>
}

export function CheckboxRenderer({value}: {
    value: boolean | undefined | null
}) {
    return <>{
        (typeof value === 'boolean')
            ? <Checkbox checked={value}/>
            : <MissingValue/>
    }</>
}

export function MonoRenderer({value}: {
    value: string | undefined | null
}) {
    return (
        <span className="font-mono text-xs">{(value !== null && value !== undefined) ? String(value) :
            <MissingValue/>}</span>
    )
}

export function EntityIdRenderer({value, entity}: {
    value: string,
    entity: string
}) {
    const navigate = useNavigate()
    return (
        (value !== null && value !== undefined)
            ? <span className="font-mono text-xs hover:underline flex cursor-pointer" onClick={(e) => {
                e.stopPropagation()
                navigate(`/admin/${entity}/${value}`)
            }}>
                <span>{value}</span>
             <ExternalLink className={"inline size-[14px] ml-1"}/>
        </span>
            : <span className="font-mono text-xs"><MissingValue/></span>
    )
}

export function OptRenderer({value}: {
    value: string | undefined | null
}) {
    return (
        <span>{(value !== null && value !== undefined) ? String(value) : <MissingValue/>}</span>
    )
}

export function ListRenderer({value}: {
    value: string[] | undefined | null
}) {
    return (
        <span>{value?.join(', ') ?? <MissingValue/>}</span>
    )
}

export function DateRenderer({value}: { value: Dayjs | null | undefined }) {
    if (!value || !value.isValid()) {
        return <MissingValue/>;
    }

    return <span>{value.format('DD.MM.YYYY HH:mm')}</span>;
}
