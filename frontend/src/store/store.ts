import {atom, createStore} from "jotai";
import type {components} from "@/schema.ts";
import {$api, $authToken, defaultOnErrorHandler, loadableQuery} from "@/api";
import {atomWithQuery} from "jotai-tanstack-query";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

export const store = createStore()

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
export type ApiUserModel = components['schemas']['UserDto']

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

export const $currentUserReposQueryOptions = (userId: string, enabled: boolean) => $api.queryOptions(
    'get',
    '/users/{userId}/repositories',
    {
        params: {
            path: {
                userId: userId
            }
        },
    },
    {enabled}
)

export const $currentUserReposQuery = atomWithQuery((get) => {
    const currentUser = get($currentUser)
    const enabled = currentUser.state === 'hasData'
    const userId = enabled ? currentUser.data.id! : ''
    return $currentUserReposQueryOptions(userId, enabled)
})

export const $currentUserRepos = loadableQuery($currentUserReposQuery)

export const $userGetRepoView = (enabled: boolean, repoId: string, branchId: string, commitHash: string) => $api.queryOptions(
    'get',
    '/repositories/{repoId}/branches/{branchId}/commits/{commitHash}/view',
    {
        params: {
            path: {
                repoId: repoId,
                branchId: branchId,
                commitHash: commitHash
            },
            query: {
                path: null
            }
        },
    },
    {enabled}
)

export const $userGetRepoViewQuery = atomWithQuery((get) => {
    const currentUser = get($currentUser)
    const enabled = currentUser.state === 'hasData'
    const userId = enabled ? currentUser.data.id! : ''
    return $userGetRepoView(enabled, get($repoId), "default", "latest")
})

export const $userCurrentRepo = loadableQuery($userGetRepoViewQuery)