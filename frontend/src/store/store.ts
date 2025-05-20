import {atom, createStore, useAtom} from "jotai";
import type {components} from "@/schema.ts";
import {$api, $authToken, loadableQuery} from "@/api";
import {atomWithQuery} from "jotai-tanstack-query";
import {useAtomValue, useSetAtom} from "jotai/react";

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
export type ApiFileContentModel = components['schemas']["FileContentDto"]

export const $repoId = atom<string | null>(null)
export const $fileId = atom<string | null>(null)
export const $branchId = atom<string | null>(null)
export const $commitId = atom<string | null>(null)

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

export const $currentRepoView = (enabled: boolean, repoId: string, branchId: string, commitId: string) => $api.queryOptions(
    'get',
    '/repositories/{repoId}/branches/{branchId}/commits/{commitId}/view',
    {
        params: {
            path: {
                repoId: repoId,
                branchId: branchId,
                commitId: commitId
            },
            query: {
                path: ''
            }
        },
    },
    {enabled}
)

export const $currentRepoViewQuery = atomWithQuery((get) => {
    const repoId = get($repoId)
    const enabled = repoId !== null
    const branchId = get($branchId) ?? "default"
    const commitId = get($commitId) ?? "latest"
    return $currentRepoView(enabled, repoId ?? '', branchId, commitId)
})

export const $currentRepo = loadableQuery($currentRepoViewQuery)

export const $fileContentView = (enabled: boolean, repoId: string, branchId: string, commitId: string, commitFileId: string) => $api.queryOptions(
    'get',
    '/repositories/{repoId}/branches/{branchId}/commits/{commitId}/files/{commitFileId}/content',
    {
        params: {
            path: {
                repoId: repoId,
                branchId: branchId,
                commitId: commitId,
                commitFileId: commitFileId
            },
        },
    },
    {enabled}
)

export const $fileContentQuery = atomWithQuery((get) => {
    const currentUser = get($currentUser)
    const enabled = currentUser.state === 'hasData'
    const repoId = get($repoId)!
    const branchId = get($branchId) ? get($branchId)! : "default"
    const commitId = get($commitId) ? get($commitId)! : "latest"
    const fileId = get($fileId)!
    return $fileContentView(enabled, repoId, branchId, commitId, fileId)
})

export const $fileContent = loadableQuery($fileContentQuery)

export const $branchCommitsView = (enabled: boolean, repoId: string, branchId: string) => $api.queryOptions(
    'get',
    '/repositories/{repoId}/branches/{branchId}/commits',
    {
        params: {
            path: {
                repoId: repoId,
                branchId: branchId,
            },
        },
    },
    {enabled}
)

export const $branchCommitsQuery = atomWithQuery((get) => {
    const currentUser = get($currentUser)
    const enabled = currentUser.state === 'hasData'
    const repoId = get($repoId)!
    const branchId = get($branchId) ? get($branchId)! : "default"
    return $branchCommitsView(enabled, repoId, branchId)
})

export const $branchCommits = loadableQuery($branchCommitsQuery)

export const $fileAstView = (enabled: boolean, repoId: string, branchId: string, commitId: string, commitFileId: string) => $api.queryOptions(
    'get',
    '/repositories/{repoId}/branches/{branchId}/commits/{commitId}/files/{commitFileId}/ast',
    {
        params: {
            path: {
                repoId: repoId,
                branchId: branchId,
                commitId: commitId,
                commitFileId: commitFileId
            },
        },
    },
    {enabled}
)

export const $fileAstQuery = atomWithQuery((get) => {
    const currentUser = get($currentUser)
    const enabled = currentUser.state === 'hasData'
    const repoId = get($repoId)!
    const branchId = get($branchId) ? get($branchId)! : "default"
    const commitId = get($commitId) ? get($commitId)! : "latest"
    const fileId = get($fileId)!
    return $fileAstView(enabled, repoId, branchId, commitId, fileId)
})

export const $fileAst = loadableQuery($fileAstQuery)

export const showRepoSettingsDialogAtom = atom(false);