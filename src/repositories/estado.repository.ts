import { connectDB } from "../database/db";
import { Estado } from "../models/Estado.model";

export const getEstados = async (): Promise<Estado[]> => {
    const pool = await connectDB();
    try {
        const result = await pool.request()
            .execute("SP_ListarEstados");
        return result.recordset as Estado[];
    } catch (error) {
        console.error('Error executing SP_ListarEstados:', error);
        throw error;
    }
};



