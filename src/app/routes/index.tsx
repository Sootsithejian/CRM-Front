import { Navigate, Route, Routes } from "react-router-dom";
 
import { ProtectedRoute } from "./ProtectedRoute";

import { AppLayout } from "../../shared/layout/AppLayout";
 
import { LoginPage } from "../../features/auth/pages/LoginPage";

import { AdminDashboardPage } from "../../features/dashboard/admin/AdminDashboardPage";

import { ConsultaClientesPage } from "../../features/clientes/pages/ConsultaClientesPage";

import { DetalleClientePage } from "../../features/clientes/pages/DetalleClientePage";

import { EditarClientePage } from "../../features/clientes/pages/EditarClientePage";

import { UsuariosPlaceholderPage } from "../../pages/UsuariosPlaceholderPage";

import { NoAutorizadoPage } from "../../pages/NoAutorizadoPage";

import { NotFoundPage } from "../../pages/NotFoundPage";
 
import { ROLES } from "../../shared/constants/roles";

import { ListaNegraPage } from "../../features/lista-negra/pages/ListaNegraPage";

import { AltaClientePage } from "../../features/clientes/pages/AltaClientePage";

import { NuevaSolicitudPage } from "../../features/creditos/pages/NuevaSolicitudPage";
import { SolicitudesPage } from "../../features/creditos/pages/SolicitudesPage";
import { ConsultaCreditosPage } from "../../features/creditos/pages/ConsultaCreditosPage";
import { DetalleCreditoPage } from "../../features/creditos/pages/DetalleCreditoPage";
 
/* Espejo de los permisos del backend. Si cambian allá, cambian aquí. */

const ROLES_LECTURA_CLIENTES = [

  ROLES.ADMINISTRADOR,

  ROLES.GERENTE_ZONA,

  ROLES.PROMOTOR,

  ROLES.AUDITOR,

  ROLES.LECTURA,

];
 
const ROLES_CAPTURA_CLIENTES = [

  ROLES.ADMINISTRADOR,

  ROLES.GERENTE_ZONA,

  ROLES.PROMOTOR,

];
 
const ROLES_USUARIOS = [

  ROLES.ADMINISTRADOR,

  ROLES.GERENTE_ZONA,

  ROLES.AUDITOR,

  ROLES.LECTURA,

];
 
export function AppRoutes() {

  return (
<Routes>
<Route path="/login" element={<LoginPage />} />
 
      {/* Sesión válida + shell con sidebar */}
<Route element={<ProtectedRoute />}>
<Route element={<AppLayout />}>
<Route path="/inicio" element={<AdminDashboardPage />} />
 
          {/* ---- Clientes: consulta ---- */}
<Route element={<ProtectedRoute roles={ROLES_LECTURA_CLIENTES} />}>

            {/* Las rutas literales van ANTES que /:id, o el router

                interpretaría "alta" o "lista-negra" como un id. */}
<Route path="/clientes" element={<ConsultaClientesPage />} />
<Route path="/clientes/lista-negra" element={<ListaNegraPage/>}/>
<Route path="/clientes/:id" element={<DetalleClientePage />} />
<Route path="/creditos" element={<ConsultaCreditosPage/>}/>
<Route path="/creditos/solicitudes" element={<SolicitudesPage/>}/>
<Route path="/creditos/:id" element={<DetalleCreditoPage/>}/>


</Route>
 
          {/* ---- Clientes: captura ---- */}
<Route element={<ProtectedRoute roles={ROLES_CAPTURA_CLIENTES} />}>
<Route path="/clientes/alta" element={<AltaClientePage/>}/>
<Route path="/clientes/:id/editar" element={<EditarClientePage />} />
<Route path="/creditos/solicitudes/nueva" element={<NuevaSolicitudPage/>}/>
</Route>
 
          {/* ---- Usuarios ---- */}
<Route element={<ProtectedRoute roles={ROLES_USUARIOS} />}>
<Route path="/usuarios" element={<UsuariosPlaceholderPage />} />
</Route>
</Route>
 
        {/* Fuera del layout: pantalla completa */}
<Route path="/no-autorizado" element={<NoAutorizadoPage />} />
</Route>
 
      <Route path="/" element={<Navigate to="/inicio" replace />} />
<Route path="*" element={<NotFoundPage />} />
</Routes>

  );

}
 