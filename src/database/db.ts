import sql from "mssql";
import { dbConfig } from "../config/db";

let pool: sql.ConnectionPool | null = null;

export const connectDB = async () => {
    try {
        if (pool) {
            return pool; 
        }

        pool = await sql.connect(dbConfig);

        console.log("✅ Conectado a SQL Server");
        return pool;
    } catch (error) {
        console.error("❌ Error al conectar a SQL Server:", error);
        throw error;
    }
};
