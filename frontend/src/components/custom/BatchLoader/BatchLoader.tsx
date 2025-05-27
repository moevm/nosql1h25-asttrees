
import * as React from "react";
import {errorMessage} from "@/api";
import type {Loadable} from "jotai/ts3.8/vanilla/utils/loadable";


export const BatchLoader = ({states, loadingMessage, display}: {
    states: Loadable<unknown>[],
    loadingMessage: string,
    display: () => React.ReactNode
}) => {
    const errorState = states.find(it => it.state === 'hasError')
    if (errorState) {
        return (<div className={"flex w-full h-full items-center justify-center"}>{"Ошибка: " + errorMessage(errorState.error)}</div>)
    }
    const someLoading = states.some(it => it.state === 'loading')
    if (someLoading) {
        return <div className={"flex w-full h-full items-center justify-center"}>{loadingMessage}</div>
    }
    return <>{display()}</>
}
