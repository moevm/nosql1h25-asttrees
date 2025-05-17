import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type {paths} from "@/schema";
import {useHydrateAtoms} from "jotai/react/utils";
import {queryClientAtom} from 'jotai-tanstack-query'
import type {ReactNode} from "react";
import {type Atom} from "jotai";
import {atomWithStorage, loadable} from "jotai/utils";
import {atom} from "jotai";
import {QueryClient} from '@tanstack/react-query'
import {toast} from "sonner";
import type {Loadable} from "jotai/utils";
import {store} from "@/store.ts";

export const $authToken = atomWithStorage<string | null>('auth_token', null)

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            experimental_prefetchInRender: true,
        },
    },
})

export const HydrateAtoms = ({ children }: { children: ReactNode }) => {
    // @ts-ignore
    useHydrateAtoms(new Map([[queryClientAtom, queryClient]]))
    return children
}

const fetchClient = createFetchClient<paths>({
    baseUrl: "http://localhost:8080",
    fetch(request) {
        const token = store.get($authToken)
        console.info('Adding token to request', {
            token
        })
        if (token !== null) {
            request.headers.set('Authorization', 'Bearer ' + token)
        }
        return globalThis.fetch(request)
    }
});
export const $api = createClient(fetchClient);

export function loadableQuery<T>(anAtom: Atom<any>): Atom<Loadable<T>> {
    return loadable(atom(async (get) => {
        return await get(anAtom).promise;
    }));
}

export function loaded<T> (loadable: Loadable<T>) {
    return loadable as {
        state: 'hasData';
        data: Awaited<T>;
    }
}

export const errorMessage: (error: unknown) => string = error => {
    if (typeof error === "string") {
        return error
    }
    if (error && typeof error === 'object') {
        if ('error' in error) {
            return String((error as { 'error': unknown })['error'])
        }
    }
    return 'Неизвестная ошибка'
}

export function defaultOnSuccessHandler() {
    toast.success("Успех")
}

export function defaultOnErrorHandler(error: unknown, variables: unknown, context: unknown) {
    console.log(`mutation error`, {error, variables, context})
    toast.error("Ошибка ", { description: errorMessage(error) })
}
