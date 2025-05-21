import {atom, createStore} from "jotai";
import type {components} from "@/schema.ts";
import {$api, $authToken, loadableQuery} from "@/api";
import {atomWithQuery} from "jotai-tanstack-query";

export const store = createStore()

export const $usersQueryOptions = () => $api.queryOptions(
    'get',
    `/entities/users`,
);
export const $usersQuery = atomWithQuery((get) => {
    return $usersQueryOptions()
})
export const $users = loadableQuery($usersQuery)

export const $reposQueryOptions = () => $api.queryOptions(
    'get',
    `/entities/repositories`,
);

export const $reposQuery = atomWithQuery((get) => {
    return $reposQueryOptions()
})

export const $repos = loadableQuery($reposQuery)

export const $commitsQueryOptions = () => $api.queryOptions(
    'get',
    `/entities/commits`,
);

export const $commitsQuery = atomWithQuery((get) => {
    return $commitsQueryOptions()
})

export const $commits = loadableQuery($commitsQuery)

export type ApiCommitModel = components['schemas']['CommitDto']

export type ApiRepositoryModel = components['schemas']['RepositoryDto']

export type ApiRepositoryViewModel = components['schemas']['RepositoryViewDto']
export type ApiUserModel = components['schemas']['UserDto']
export type ApiFileContentModel = components['schemas']["FileContentDto"]
export type ApiFileAstModel = components['schemas']["FileAstDto"]
export type ApiEntityRepositoryModel = components['schemas']['EntityRepositoryDto']
export type ApiEntityCommitModel = components['schemas']['EntityCommitDto']
export type ApiEntityBranchModel = components['schemas']['EntityBranchDto']
export type ApiEntityUserModel = components['schemas']['EntityUserDto']

export const $repoId = atom<string | null>(null)
export const $fileId = atom<string | null>(null)
export const $branchId = atom<string | null>(null)
export const $commitId = atom<string | null>(null)
export const $path = atom("")

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

export const $currentRepoViewQueryOptions = (enabled: boolean, repoId: string, branchId: string, commitId: string, path: string) => $api.queryOptions(
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
                path: path
            }
        },
    },
    {enabled}
)

export const $currentRepoViewQuery = atomWithQuery((get) => {
    const repoId = get($repoId)
    const branchId = get($branchId) ?? "default"
    const commitId = get($commitId) ?? "latest"
    const enabled = repoId !== null
        && branchId !== null
        && commitId !== null
    const path = get($path)
    return $currentRepoViewQueryOptions(enabled, repoId ?? '', branchId, commitId, path)
})

export const $currentRepo = loadableQuery($currentRepoViewQuery)

export const $fileContentQueryOptions = (enabled: boolean, repoId: string, branchId: string, commitId: string, commitFileId: string) => $api.queryOptions(
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
    const repoId = get($repoId)!
    const branchId = get($branchId)
    const commitId = get($commitId)
    const fileId = get($fileId)!
    const enabled = currentUser.state === 'hasData'
        && repoId !== null
        && branchId !== null
        && commitId !== null
        && fileId !== null
    return $fileContentQueryOptions(enabled, repoId, branchId!, commitId!, fileId)
})

export const $fileContent = loadableQuery($fileContentQuery)

export const $branchCommitsQueryOptions = (enabled: boolean, repoId: string, branchId: string) => $api.queryOptions(
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
    const repoId = get($repoId)
    const branchId = get($branchId) ? get($branchId)! : "default"
    const enabled = currentUser.state === 'hasData'
        && repoId !== null
        && branchId !== null
    return $branchCommitsQueryOptions(enabled, repoId!, branchId)
})

export const $branchCommits = loadableQuery($branchCommitsQuery)

export const $fileAstQueryOptions = (enabled: boolean, repoId: string, branchId: string, commitId: string, commitFileId: string) => $api.queryOptions(
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
    const fileContent = get($fileContent)

    const enabled = currentUser.state === 'hasData'
        && fileContent.state === 'hasData'
        && fileContent.data.hasAst === true
    return $fileAstQueryOptions(enabled, get($repoId)!, get($branchId)!, get($commitId)!, get($fileId)!)
})

export const $fileAst = loadableQuery($fileAstQuery)

export const showRepoSettingsDialogAtom = atom(false);

export const $branchesQueryOptions = () => $api.queryOptions(
    'get',
    `/entities/branches`,
);
export const $branchesQuery = atomWithQuery((get) => {
    return $branchesQueryOptions()
})
export const $branches = loadableQuery($branchesQuery)