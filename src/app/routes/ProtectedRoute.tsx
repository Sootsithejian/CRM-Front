import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../features/auth/hooks/useAuth";

import type { Rol } from "../../shared/constants/roles";
 
interface ProtectedRouteProps {

  /** Roles permitidos.*/

  roles?: Rol[];

}
 
export function ProtectedRoute({ roles }: ProtectedRouteProps) {

  const { sesion } = useAuth();

  const location = useLocation();
 
  // Sin sesión: al login

  if (!sesion) {

    return <Navigate to="/login" replace state={{ desde: location }} />;

  }
 
  // Con sesión pero sin permiso

  if (roles && !roles.includes(sesion.rol)) {

    return <Navigate to="/no-autorizado" replace />;

  }
 
  return <Outlet />;

}
 