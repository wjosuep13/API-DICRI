import { connectDB } from "../database/db";
import sql from "mssql";

interface response {
    password: string;
    id: number;
    rol: string;
}

export const getLoginInfo = async (userId: string): Promise<response | null> => {

    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input("UserId", sql.VarChar, userId)
            .execute("SP_GetloginInfo");
        const row=result.recordset[0];
        return result.recordset.length > 0 ?
            {
                password: row.password,
                id: row.id,
                rol: row.rol
            } : null;
    } catch (error) {
        console.error('Error fetching password:', error);
        throw error;
    }
};