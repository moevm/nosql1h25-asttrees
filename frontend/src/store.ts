import {atom, createStore} from "jotai";
import type {components} from "@/schema.ts";
import {$api, $authToken, loadableQuery} from "@/api";
import {atomWithQuery} from "jotai-tanstack-query";

export const store = createStore()

export type ApiCommitModel = components['schemas']['CommitDto']
export type ApiRepositoryModel = components['schemas']['RepositoryDto']
export type ApiRepositoryViewModel = components['schemas']['RepositoryViewDto']
export type ApiUserModel = components['schemas']['UserDto']

export const $userId = atom<string | null>(null)
export const $repoId = atom<string | null>(null)
export const $fileId = atom<string | null>(null)

export const $currentUserQueryOptions = (enabled: boolean) => $api.queryOptions(
    'get',
    '/users/me',
    {},
    {enabled}
)

export const $currentUserQuery = atomWithQuery((get) => {
    return $currentUserQueryOptions(get($authToken) !== null)
})

export const $currentUser = loadableQuery($currentUserQuery)
