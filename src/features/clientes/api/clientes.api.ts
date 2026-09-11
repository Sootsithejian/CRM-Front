import { api } from "../../../shared/api/client";

import type {

  Catalogos,

  ClienteDetalle,

  ClienteFormInput,

  FiltrosClientes,

  RespuestaListado,

} from "../types";
 
export async function listarClientes(

  filtros: FiltrosClientes = {}

): Promise<RespuestaListado> {

  const { data } = await api.get<RespuestaListado>("/clientes", { params: filtros });

  return data;

}
 
export async function obtenerCliente(id: number): Promise<ClienteDetalle> {

  const { data } = await api.get<ClienteDetalle>(`/clientes/${id}`);

  return data;

}
 
export async function obtenerCatalogos(): Promise<Catalogos> {

  const { data } = await api.get<Catalogos>("/clientes/catalogos");

  return data;

}
 
export interface RespuestaAlta {

  message: string;

  cliente: {

    id: number;

    numero_cliente: number;

    id_persona: number;

    nombre: string;

    curp: string | null;

  };

}
 
export async function crearCliente(

  payload: ClienteFormInput

): Promise<RespuestaAlta> {

  const { data } = await api.post<RespuestaAlta>("/clientes", payload);

  return data;

}
 
export async function actualizarCliente(

  id: number,

  payload: Partial<ClienteFormInput>

): Promise<{ message: string }> {

  const { data } = await api.patch<{ message: string }>(`/clientes/${id}`, payload);

  return data;

}
 