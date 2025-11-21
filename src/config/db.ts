import 'dotenv/config';

export const dbConfig = {
  server: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT!) || 1433,
  options:{
    encrypt: true,
    trustServerCertificate: true,
  }
};