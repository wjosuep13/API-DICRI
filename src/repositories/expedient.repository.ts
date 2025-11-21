import { connectDB } from "../database/db";
import sql, { IRecordSet } from "mssql";
import { ExpedientDetailResponse, ExpedienteRequest, Historial } from "../models/Expediente.model";



export const createExpedient = async (data: ExpedienteRequest, userId: number): Promise<boolean> => {
    const pool = await connectDB();
    try {
        await pool.request()
            .input("nombre", sql.VarChar(50), data.nombre)
            .input("descripcion", sql.VarChar(200), data.descripcion)
            .input("fecha_creacion", sql.Date, data.fecha_creacion)
            .input("id_usuario", sql.Int, userId)
            .execute("SP_CrearExpediente");
        return true;
    } catch (error) {
        console.error('Error executing stored procedure:', error);
        throw error;
    }
};

export const getExpedients = async (userId: number, userRole: number): Promise<ExpedienteRequest[]> => {
    return new Promise(async (resolve, reject) => {
        const pool = await connectDB();
        try {
            const result = await pool.request()
                .input("id_tecnico", sql.Int, userId)
                .input("rol", sql.Int, userRole)
                .execute("sp_listar_expedientes");

            const expedients: ExpedienteRequest[] = result.recordset.map((record) => ({
                no_expediente: record.no_expediente,
                nombre: record.nombre,
                descripcion: record.descripcion,
                fecha_creacion: record.fecha_creacion,
                id_usuario: record.id_usuario,
                estado_actual: record.descripcion_estado
            }));
            resolve(expedients);
        } catch (error) {
            console.error('Error listing expedients:', error);
            reject(error);
        }
    });
}

export const getExpedientDetail = async (expedientId: number): Promise<ExpedientDetailResponse | null> => {
    const pool = await connectDB();
    try {
        const result = await pool.request()
            .input("IdExpediente", sql.Int, expedientId)
            .execute("SP_GetExpedienteById");

        if (result.recordsets.length === 0) {
            return null;
        }

        const expediente = Array.isArray(result.recordsets) && result.recordsets[0] && result.recordsets[0].length > 0 ? result.recordsets[0][0] : null;
        const historial = (result.recordsets as IRecordSet<any>[])[1];

        const estadoActual = historial && historial.length > 0 ? historial[0] : null;
        const expedientDetail: ExpedientDetailResponse = {
            no_expediente: expediente.no_expediente,
            nombre: expediente.nombre,
            descripcion: expediente.descripcion,
            fecha_creacion: expediente.fecha_creacion,
            estado_actual: estadoActual.descripcion_estado,
            historial_estados: historial as Historial[],
        };

        return expedientDetail;
    } catch (error) {
        console.error('Error fetching expedient detail:', error);
        throw error;
    }
}

export const changeStatusExpedient = async (expedientId: number, newStatus:number,idUsuario:number,motivo?:string): Promise<boolean> => {
    const pool = await connectDB();
    try {
        await pool.request()
            .input("IdExpediente", sql.Int, expedientId)
            .input("IdUsuario", sql.Int,idUsuario)
            .input("IdEstado", sql.Int, newStatus)
            .input("DescripcionCambio", sql.VarChar, motivo)
            .execute("SP_CambiarEstadoExpediente");
        return true;
    } catch (error) {
        console.error('Error executing stored procedure:', error);
        throw error;
    }
}

export const getExpedientStatusHistoryOnRange = async (startDate:Date,endDate:Date,id_estado?: number): Promise<Historial[]> => {
    const pool = await connectDB();
    try {
        const result = await pool.request()
            .input("IdEstado", sql.Int, id_estado)
            .input("FechaInicio", sql.Date, startDate)
            .input("FechaFin", sql.Date, endDate)
            .execute("SP_FiltrarHistorialEstados");

        return result.recordset as Historial[];
    } catch (error) {
        console.error('Error fetching status history:', error);
        throw error;
    }
}