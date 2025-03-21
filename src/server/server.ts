import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import turnRoutes from './routes/turnRoutes';
import matchmakingRoutes from './routes/matchmakingRoutes';
import playerRoutes from './routes/playerRoutes';
import queueRoutes from './routes/queueRoutes';
import { Client } from '../client/client';
// Configuration des variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Intégration des routes principales
app.use('/api/turns', turnRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/queue', queueRoutes);

const client = new Client(1, "http://localhost:3000/api");
client.joinQueue(1);  
client.getQueueStatus();

// Route par défaut
app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});

// Gestion des routes non définies
app.use((req: Request, res: Response) => {
    res.status(404).send({ message: 'Route not found' });
});

// Gestion globale des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;




