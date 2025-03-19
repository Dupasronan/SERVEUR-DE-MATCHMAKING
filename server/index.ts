import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initDatabase, AppDataSource } from './database/config';
import { QueueEntry } from './entities/QueueEntry';
import { Match } from './entities/Match';
import { Turn } from './entities/Turn';
import { SocketHandler } from './socket/SocketHandler';
import { MatchmakingService } from './services/MatchmakingService';

async function startServer() {
  try {
    await initDatabase();
    
    const queueRepository = AppDataSource.getRepository(QueueEntry);
    const matchRepository = AppDataSource.getRepository(Match);
    const turnRepository = AppDataSource.getRepository(Turn);
    
    const app = express();
    const httpServer = http.createServer(app);
    
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    new SocketHandler(io, queueRepository, matchRepository, turnRepository);
    
    const matchmakingService = new MatchmakingService(io, queueRepository, matchRepository);
    matchmakingService.start();
    
    app.get('/', (req, res) => {
      res.send('Tic Tac Toe Matchmaking Server is running');
    });
    
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      matchmakingService.stop();
      await AppDataSource.destroy();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
