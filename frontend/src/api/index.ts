import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type {paths} from "@/schema";
import {useHydrateAtoms} from "jotai/react/utils";
import {queryClientAtom} from 'jotai-tanstack-query'
import { atomWithQuery } from "jotai-tanstack-query";
import {ReactNode} from "react";
import type {Atom} from "jotai/vanilla";
import {loadable} from "jotai/utils";
import {atom} from "jotai";
import {QueryClient} from '@tanstack/react-query'
import {toast} from "sonner";
import type {Loadable} from "jotai/ts3.8/vanilla/utils/loadable";
import type {UseMutationOptions} from "@tanstack/react-query/build/legacy/types";


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
        if ('message' in error) {
            return String((error as { 'message': unknown })['message'])
        }
        if ('detail' in error) {
            return String((error as { 'detail': unknown })['detail'])
        }
    }
    return 'Неизвестная ошибка'
}

// TODO show loader & toast
export function createMutationOptions<D, E, I>(options?: Omit<UseMutationOptions<D, E, I>, "mutationKey" | "mutationFn">): Omit<UseMutationOptions<D, E, I>, "mutationKey" | "mutationFn"> {
    return {
        onMutate: (variables) => {
            if (options?.onMutate) options.onMutate(variables)
        },
        onError: (error, variables, context) => {
            console.log(`mutation error`, {error, variables, context})
            toast.error("Ошибка ", { description: errorMessage(error) })
            if (options?.onError) options.onError(error, variables, context)
        },
        onSuccess: (data, variables, context) => {
            toast.success("Успех")
            if (options?.onSuccess) options.onSuccess(data, variables, context)
        },
    }
}
