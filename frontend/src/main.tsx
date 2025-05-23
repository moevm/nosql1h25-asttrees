import {createRoot} from 'react-dom/client'
import './index.css'
import 'highlight.js/styles/github.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthorisationPage from "@/routes/reg-auth-page/AuthorisationPage.tsx";
import AdminPanelLayout from "@/routes/admin-panel/AdminPanelLayout.tsx";
import AdminUsersPage from "@/routes/admin-panel/users/AdminUsersPage.tsx";
import AdminReposPage from "@/routes/admin-panel/repos/AdminReposPage.tsx";
import AdminCommitsPage from "@/routes/admin-panel/commits/AdminCommitsPage.tsx";
import AdminAstTreesPage from "@/routes/admin-panel/ast-trees/AdminAstTreesPage.tsx";
import AdminImportExportDBPage from "@/routes/admin-panel/import-export-db/AdminImportExportDBPage.tsx";
import HeaderLayout from "@/routes/header-layout/HeaderLayout.tsx";
import UserPage from "@/routes/user-panel/user/UserPage.tsx";
import RepoViewPage from "@/routes/user-panel/user/repo-panel/repo/RepoViewPage.tsx";
import UserLayout from "@/routes/user-panel/UserLayout.tsx";
import RepoLayout from "@/routes/user-panel/user/repo-panel/RepoLayout.tsx";
import {QueryClientProvider} from "@tanstack/react-query";
import {HydrateAtoms, queryClient} from "@/api";
import {Toaster} from "sonner";
import CommitHistoryViewPage
    from "@/routes/user-panel/user/repo-panel/repo/commit-history-panel/CommitHistoryViewPage.tsx";
import {Provider} from "jotai/react";
import {SessionManager} from "@/components/SessionManager.tsx";
import {store} from "@/store/store.ts";
import CommitLayout from "@/routes/user-panel/user/repo-panel/repo/commit-panel/CommitLayout.tsx";
import FileLayout from "@/routes/user-panel/user/repo-panel/repo/commit-panel/commit/file-panel/FileLayout.tsx";
import FileViewPage
    from "@/routes/user-panel/user/repo-panel/repo/commit-panel/commit/file-panel/file/FileViewPage.tsx";
import AdminBranchesPage from "@/routes/admin-panel/branches/AdminBranchesPage.tsx";
import React from "react";
import AdminFilesPage from "@/routes/admin-panel/files/AdminFilesPage.tsx";
import AdminUserPage from "@/routes/admin-panel/users/user/AdminUserPage.tsx";
import AdminRepoPage from "@/routes/admin-panel/repos/repo/AdminRepoPage.tsx";
import AdminBranchPage from "@/routes/admin-panel/branches/branch/AdminBranchPage.tsx";
import AdminCommitPage from "@/routes/admin-panel/commits/commit/AdminCommitPage.tsx";
import AdminAstTreePage from "@/routes/admin-panel/ast-trees/ast-tree/AdminAstTreePage.tsx";

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <HydrateAtoms>
                <Toaster/>
                <BrowserRouter>
                    <SessionManager/>
                    <Routes>
                        <Route element={<HeaderLayout/>}>
                            <Route path="/auth/:tab" element={<AuthorisationPage/>}/>
                            <Route path="/" element={<Navigate to="/auth/login"/>}/>

                            <Route path="users/:userId" element={<UserLayout />}>
                                <Route path="" element={<UserPage />} />
                                <Route path="repo/:repoId/branch/:branchId" element={<RepoLayout />}>
                                    <Route path="commits" element={<CommitHistoryViewPage />} />
                                    <Route path="commit/:commitId" element={<CommitLayout />}>
                                        <Route path="file/:fileId" element={<FileLayout />}>
                                            <Route path="" element={<FileViewPage />} />
                                        </Route>
                                        <Route path="" element={<RepoViewPage />} />
                                    </Route>
                                </Route>
                            </Route>

                            <Route path="admin" element={<AdminPanelLayout/>}>
                                <Route index element={<Navigate to="users" replace/>}/>
                                <Route path="branches" element={<AdminBranchesPage/>}/>
                                <Route path="branches/:adminBranchId" element={<AdminBranchPage/>}/>
                                <Route path="users" element={<AdminUsersPage/>}/>
                                <Route path="users/:adminUserId" element={<AdminUserPage/>}/>
                                <Route path="repos" element={<AdminReposPage/>}/>
                                <Route path="repos/:adminRepoId" element={<AdminRepoPage/>}/>
                                <Route path="commits" element={<AdminCommitsPage/>}/>
                                <Route path="commits/:adminCommitId" element={<AdminCommitPage/>}/>
                                <Route path="files" element={<AdminFilesPage/>}/>
                                <Route path="ast-trees" element={<AdminAstTreesPage/>}/>
                                <Route path="ast-trees/:adminAstTreeId" element={<AdminAstTreePage/>}/>
                                <Route path="import-export" element={<AdminImportExportDBPage/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </HydrateAtoms>
        </Provider>
    </QueryClientProvider>
)
