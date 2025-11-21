export interface Indicio {
    id_indicio: number;
    descripcion: string;
    color: string;
    tamaño: string;
    peso_libras: number;
    ubicacion: string;
    id_tecnico?: number;
    no_expediente?: number;
}