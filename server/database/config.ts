import { DataSource } from 'typeorm';
import { QueueEntry } from '../entities/QueueEntry';
import { Match } from '../entities/Match';
import { Turn } from '../entities/Turn';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '..', '..', 'database.sqlite'),
  synchronize: true, 
  logging: false,
  entities: [QueueEntry, Match, Turn],
  migrations: [],
  subscribers: [],
});

export const initDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized');
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
