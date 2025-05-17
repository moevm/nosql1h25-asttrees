import {atom} from "jotai";
import type {components} from "@/schema.ts";
import {$api, loadableQuery} from "@/api";
import {atomWithQuery} from "jotai-tanstack-query";

export const $userId = atom<string | null>(null)

export const $repoId = atom<string | null>(null)

export const $fileId = atom<string | null>(null)

export const $usersQueryOptions = () => $api.queryOptions(
    'get',
    `/entities/users`,
);
export const $usersQuery = atomWithQuery((get) => {
    return $usersQueryOptions()
})
export const $users = loadableQuery($usersQuery)

export type ApiCommitModel = components['schemas']['CommitDto']

export type ApiRepositoryModel = components['schemas']['RepositoryDto']

export type ApiRepositoryViewModel = components['schemas']['RepositoryViewDto']

export type ApiCommitFileModel = components['schemas']['CommitFileDto']

export type ApiUserModel = components['schemas']['UserDto']
