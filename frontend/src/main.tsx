import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthorisationPage from "@/routes/reg-auth-page/AuthorisationPage.tsx";
import AdminPanelLayout from "@/routes/admin-panel/AdminPanelLayout.tsx";
import UsersPage from "@/routes/admin-panel/users/UsersPage.tsx";
import ReposPage from "@/routes/admin-panel/repos/ReposPage.tsx";
import CommitsPage from "@/routes/admin-panel/commits/CommitsPage.tsx";
import FilesPage from "@/routes/admin-panel/files/FilesPage.tsx";
import AstTreesPage from "@/routes/admin-panel/ast-trees/AstTreesPage.tsx";
import ImportExportDBPage from "@/routes/admin-panel/import-export-db/ImportExportDBPage.tsx";
import Header from "@/components/custom/header/Header.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            {/*<Header/>*/}
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/auth" element={<AuthorisationPage/>}/>
                <Route path="/admin" element={<Navigate relative="path" to="users" replace/>}/>
                <Route path="admin" element={<AdminPanelLayout/>}>
                    <Route path="users" element={<UsersPage/>}/>
                    <Route path="repos" element={<ReposPage/>}/>
                    <Route path="commits" element={<CommitsPage/>}/>
                    <Route path="files" element={<FilesPage/>}/>
                    <Route path="ast-trees" element={<AstTreesPage/>}/>
                    <Route path="import-export" element={<ImportExportDBPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)