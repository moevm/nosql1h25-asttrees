import {createRoot} from 'react-dom/client'
import './index.css'
import 'highlight.js/styles/intellij-light.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthorisationPage from "@/routes/reg-auth-page/AuthorisationPage.tsx";
import AdminPanelLayout from "@/routes/admin-panel/AdminPanelLayout.tsx";
import UsersAdmninPage from "@/routes/admin-panel/users/UsersAdmninPage.tsx";
import ReposAdminPage from "@/routes/admin-panel/repos/ReposAdminPage.tsx";
import CommitsAdminPage from "@/routes/admin-panel/commits/CommitsAdminPage.tsx";
import FilesPage from "@/routes/admin-panel/files/FilesPage.tsx";
import AstTreesPage from "@/routes/admin-panel/ast-trees/AstTreesPage.tsx";
import ImportExportDBPage from "@/routes/admin-panel/import-export-db/ImportExportDBPage.tsx";
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
import BranchesPage from "@/routes/admin-panel/branches/BranchesPage.tsx";

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <HydrateAtoms>
                <Toaster/>
                <BrowserRouter>
                    <SessionManager/>
                    <Routes>
                        <Route element={<HeaderLayout/>}>
                            <Route path="/:tab" element={<AuthorisationPage/>}/>
                            <Route path="/" element={<Navigate to="/login"/>}/>

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
                                <Route path="branches" element={<BranchesPage/>}/>
                                <Route path="users" element={<UsersAdmninPage/>}/>
                                <Route path="repos" element={<ReposAdminPage/>}/>
                                <Route path="commits" element={<CommitsAdminPage/>}/>
                                <Route path="files" element={<FilesPage/>}/>
                                <Route path="ast-trees" element={<AstTreesPage/>}/>
                                <Route path="import-export" element={<ImportExportDBPage/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </HydrateAtoms>
        </Provider>
    </QueryClientProvider>
)
