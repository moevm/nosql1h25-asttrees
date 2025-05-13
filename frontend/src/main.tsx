import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthorisationPage from "@/routes/reg-auth-page/AuthorisationPage.tsx";
import Header from "@/components/custom/header/Header.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Header/>
          <Routes>
              <Route path={"/"} element={<App/>} />
              <Route path={"/auth"} element={<AuthorisationPage/>} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
