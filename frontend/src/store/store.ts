import {atom, createStore} from "jotai";
import type {components} from "@/schema.ts";
import {$api, $authToken, loadableQuery} from "@/api";
import {atomWithQuery} from "jotai-tanstack-query";
import type {EntityField} from "@/lib/utils.ts";

export const store = createStore()

export const $adminUserQueryOptions = (userId: string) => $api.queryOptions(
    'get',
    `/entities/users/{userId}`,
    {
        params: {
            path: {
                userId: userId
            }
        },
    },
);
export const $adminUserQuery = atomWithQuery((get) => {
    const adminUserId = get($adminUserId)
    return $adminUserQueryOptions(adminUserId!)
})
export const $adminUser = loadableQuery($adminUserQuery)

export const $adminRepoQueryOptions = (repoId: string) => $api.queryOptions(
    'get',
    `/entities/repositories/{repositoryId}`,
    {
        params: {
            path: {
                repositoryId: repoId
            }
        },
    },
);
export const $adminRepoQuery = atomWithQuery((get) => {
    const adminRepoId = get($adminRepoId)
    return $adminRepoQueryOptions(adminRepoId!)
})
export const $adminRepo = loadableQuery($adminRepoQuery)

export const $adminBranchQueryOptions = (branchId: string) => $api.queryOptions(
    'get',
    `/entities/branches/{branchId}`,
    {
        params: {
            path: {
                branchId: branchId
            }
        },
    },
);
export const $adminBranchQuery = atomWithQuery((get) => {
    const adminBranchId = get($adminBranchId)
    return $adminBranchQueryOptions(adminBranchId!)
})
export const $adminBranch = loadableQuery($adminBranchQuery)

export const $adminCommitQueryOptions = (commitId: string) => $api.queryOptions(
    'get',
    `/entities/commits/{commitId}`,
    {
        params: {
            path: {
                commitId: commitId
            }
        },
    },
);
export const $adminCommitQuery = atomWithQuery((get) => {
    const adminCommitId = get($adminCommitId)
    return $adminCommitQueryOptions(adminCommitId!)
})
export const $adminCommit = loadableQuery($adminCommitQuery)

export const $adminAstTreeQueryOptions = (astTreeId: string) => $api.queryOptions(
    'get',
    `/entities/ast_trees/{astTreeId}`,
    {
        params: {
            path: {
                astTreeId: astTreeId
            }
        },
    },
);
export const $adminAstTreeQuery = atomWithQuery((get) => {
    const adminAstTreeId = get($adminAstTreeId)
    return $adminAstTreeQueryOptions(adminAstTreeId!)
})
export const $adminAstTree = loadableQuery($adminAstTreeQuery)

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
export type ApiEntityAstTreeModel = components['schemas']['EntityAstTreeDto']

export const $repoId = atom<string | null>(null)
export const $fileId = atom<string | null>(null)
export const $branchId = atom<string | null>(null)
export const $commitId = atom<string | null>(null)
export const $userId = atom<string | null>(null)
export const $adminUserId = atom<string | null>(null)
export const $adminRepoId = atom<string | null>(null)
export const $adminBranchId = atom<string | null>(null)
export const $adminCommitId = atom<string | null>(null)
export const $adminAstTreeId = atom<string | null>(null)
export const $path = atom("")

export const $userQueryOptions = (userId: string, enabled: boolean) => $api.queryOptions(
    'get',
    '/users/{userId}',
    {
        params: {
            path: {
                userId
            }
        }
    },
    {enabled}
)

export const $userQuery = atomWithQuery((get) => {
    const userId = get($userId);
    const enabled = !!userId
    return $userQueryOptions(userId ?? '', enabled)
})

export const $user = loadableQuery($userQuery)

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

export const $userReposQuery = atomWithQuery((get) => {
    const userId = get($userId);
    const enabled = !!userId
    return $currentUserReposQueryOptions(userId ?? '', enabled)
})

export const $userRepos = loadableQuery($userReposQuery)

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
    const repoId = get($repoId)!
    const branchId = get($branchId)
    const commitId = get($commitId)
    const fileId = get($fileId)!
    const enabled = repoId !== null
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
    const repoId = get($repoId)
    const branchId = get($branchId) ? get($branchId)! : "default"
    const enabled = repoId !== null
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
    const fileContent = get($fileContent)

    const enabled = fileContent.state === 'hasData'
        && fileContent.data.hasAst === true
    return $fileAstQueryOptions(enabled, get($repoId)!, get($branchId)!, get($commitId)!, get($fileId)!)
})

export const $fileAst = loadableQuery($fileAstQuery)

export const $showRepoSettingsDialog = atom(false);
export const $showVisualizationDialog = atom(false);
export const $showEditUserDialog = atom(false)
export const $showEditRepoDialog = atom(false)
export const $showEditBranchDialog = atom(false)
export const $showEditCommitDialog = atom(false)
export const $showEditAstTreeDialog = atom(false)
export const $showEditFileDialog = atom(false)
export const $repoSettingsDialogRepo = atom<ApiRepositoryModel | null>(null)
export const $currentEntitiesFieldsAtom = atom<EntityField[] | null>(null);
