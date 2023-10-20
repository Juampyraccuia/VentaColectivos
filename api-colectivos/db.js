import mysql from "mysql2/promise";

// Conectar a base de datos
const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ventacolectivos",
    namedPlaceholders: true,
})
console.console.log("Conectado a base de datos")