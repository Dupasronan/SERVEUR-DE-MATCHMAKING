import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

// Créer une connexion à la base de données
export const promisePool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'christian',
  password: process.env.DB_PASSWORD || 'ton_mot_de_passe',
  database: process.env.DB_NAME || 'matchmaking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fonction de connexion à la BDD
export const connect = async (): Promise<mysql.PoolConnection | null> => {
  try {
    const connection = await promisePool.getConnection();
    console.log('Connexion à la base de données réussie');
    return connection;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    return null;  // Retourner null en cas d'échec
  }
};

// Fonction de fermeture de la connexion à la BDD
export const disconnect = async (connection: mysql.PoolConnection): Promise<void> => {
  try {
    await connection.release();
    console.log('Connexion à la base de données fermée');
  } catch (error) {
    console.error('Erreur de fermeture de la connexion à la base de données:', error);
  }
};
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
