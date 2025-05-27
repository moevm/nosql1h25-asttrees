import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Dayjs} from "dayjs";
import {Button} from "@/components/ui/button.tsx";
import {ExternalLink} from "lucide-react";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";

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

export function DateRenderer({value}: { value: Dayjs | null | undefined }) {
    if (!value || !value.isValid()) {
        return <MissingValue/>;
    }

    return <span>{value.format('DD.MM.YYYY HH:mm')}</span>;
}

export function ListRenderer<T>(
    {
        value,
        renderer,
    }: {
        value: T[];
        renderer: (props: { value: T }) => React.ReactNode;
    }) {
    const [showAll, setShowAll] = useState(false);
    const initialVisibleCount = 1;

    if (!value || value.length === 0) {
        return <MissingValue/>;
    }

    if (!showAll && value.length > initialVisibleCount) {
        const remainingCount = value.length - initialVisibleCount;
        const firstItem = value[0];

        return (
            <span className={"flex items-center"}>
                {renderer({value: firstItem})}
                <Button
                    variant={"secondary"}
                    className={"!py-0 px-1 ml-2 h-[16px] !text-xs leading-none"}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowAll(true);
                    }}
                >
          Показать ещё {remainingCount}
        </Button>
      </span>
        );
    }

    return (
        <span className={"flex"}>
            {value.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span>,&nbsp;&nbsp;</span>}
                    {renderer({value: item})}
                </React.Fragment>
            ))}
    </span>
    );
}
