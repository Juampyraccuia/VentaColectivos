import mysql from "mysql2/promise";
import "dotenv/config"
// Conectar a base de datos
export const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    namedPlaceholders: true,
})
console.log("Conectado a base de datos")