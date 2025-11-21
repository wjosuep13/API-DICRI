import { Indicio } from "./Indicio.model";
import { Tecnico } from "./Tecnico.model";
export interface ExpedienteRequest {
    no_expediente: string;
    nombre: string;
    descripcion: string;
    fecha_creacion: Date;
    id_usuario?: number;
    estado_actual?: string;
}

export interface Historial{
    id: number;
    descripcion_estado: string;
    fecha_actualizacion: string;
    tecnico: Tecnico;

}

export interface ExpedientDetailResponse {
    no_expediente: string;
    nombre: string;
    descripcion: string;
    fecha_creacion: Date;
    estado_actual: string;
    historial_estados: Historial[];
    inidicios?: Indicio[];
}