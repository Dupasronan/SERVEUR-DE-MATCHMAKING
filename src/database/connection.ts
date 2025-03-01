import mysql from 'mysql2/promise';

// Paramètres de connexion
const dbConfig = {
    host: 'localhost',
    user: 'christian',
    password: '220294M.',
    database: 'matchmaking'
};

// Fonction de connexion à la BDD
export async function connectDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connexion à MariaDB réussie !');
        return connection;
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error);
        process.exit(1);
    }
}
