const { Pool } = require('pg');
require('dotenv').config(); // Para carregar variáveis do .env

let pool;

// Função para conectar ao PostgreSQL
async function connect() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.CONNECTION_STRING,
        });

        try {
            const client = await pool.connect();
            console.log("✅ Conectado ao PostgreSQL!");
            client.release(); // Libera a conexão para o pool
        } catch (error) {
            console.error("❌ Erro ao conectar ao PostgreSQL:", error);
            process.exit(1); // Encerra o app se não conectar
        }
    }
    return pool;
}

// Função para executar queries no banco
async function query(text, params) {
    const pool = await connect(); // Obtém o pool de conexões
    const client = await pool.connect(); // Obtém um client do pool

    try {
        const result = await client.query(text, params);
        return result;
    } catch (error) {
        console.error("❌ Erro ao executar query:", error);
        throw error;
    } finally {
        client.release(); // Libera o client de volta para o pool
    }
}

module.exports = { connect, query };
