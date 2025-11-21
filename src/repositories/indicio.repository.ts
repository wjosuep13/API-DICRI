import { connectDB } from "../database/db";
import sql from "mssql";
import { Indicio } from "../models/Indicio.model";



export const createIndicio = async (data:Indicio , userId: number): Promise<boolean> => {
    const pool = await connectDB();
    try {
        await pool.request()
            .input("Descripcion", sql.VarChar, data.descripcion)
            .input("Color", sql.VarChar, data.color)
            .input("Tamanio", sql.VarChar, data.tamaño)
            .input("Peso_Libras", sql.Decimal, data.peso_libras)
            .input("Ubicacion", sql.VarChar, data.ubicacion)
            .input("id_tecnico", sql.Int, userId)
            .input("no_expediente", sql.VarChar,data.no_expediente?.toString())
            .execute("SP_CrearIndicio");
        return true;
    } catch (error) {
        console.error('Error executing SP_CrearIndicio:', error);
        throw error;
    }
};

export const getIndiciosByExpedient = async (no_expediente: number): Promise<Indicio[]> => {
    const pool = await connectDB();
    try {
        const result = await pool.request()
            .input("no_expediente", sql.Int, no_expediente)
            .execute("SP_ListarIndicios");
        return result.recordset as Indicio[];
    } catch (error) {
        console.error('Error executing SP_ListarIndicios:', error);
        throw error;
    }
};



