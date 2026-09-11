import { Alert } from "../shared/ui";

export function UsuariosPlaceholderPage() {
    return(
        <div className="mx-auto max-w-3x1">
            <h1 className="mb-2 text-2x1 font-bold text-slate-900">Usuarios</h1>
            <p className="mb-6 text-slate-500">
                Administración de usuarios del sistema.
            </p>
            <Alert variant="info" title="Módulo en construcción">
                El backend ya expone los endpoints de usuarios. Esta pantalla se construye
                en el siguiente entregable
            </Alert>
        </div>
    );
}