import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import turnRoutes from './routes/turnRoutes';
import matchmakingRoutes from './routes/matchmakingRoutes';
import playerRoutes from './routes/playerRoutes';
import queueRoutes from './routes/queueRoutes';

// Configuration des variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Intégration des routes principales
app.use('/api/turns', turnRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/queue', queueRoutes);

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;




