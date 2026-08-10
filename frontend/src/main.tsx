import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/index.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import Points from './pages/Points'
import Lubricants from './pages/Lubricants'
import Rodamientos from './pages/Rodamientos'
import WorkOrders from './pages/WorkOrders'
import Usuarios from './pages/Usuarios'
import ForgotPassword from './pages/ForgotPassword'
import { getToken } from './services/auth'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/activos" element={<PrivateRoute><Assets /></PrivateRoute>} />
        <Route path="/puntos" element={<PrivateRoute><Points /></PrivateRoute>} />
        <Route path="/lubricantes" element={<PrivateRoute><Lubricants /></PrivateRoute>} />
        <Route path="/rodamientos" element={<PrivateRoute><Rodamientos /></PrivateRoute>} />
        <Route path="/ordenes" element={<PrivateRoute><WorkOrders /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
