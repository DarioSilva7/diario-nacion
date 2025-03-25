import 'reflect-metadata';

import app from './app';
import { AppDataSource } from './config/database';
import { envs } from './config/envs';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import redisClient from './config/redis';

const PORT = envs.port;

const uploadsDir = path.join(__dirname, '../uploads/profile-images');

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
  console.log('🚀 ~ carpeta creada:');
}

AppDataSource.getInstance()
  .initialize()
  .then(async () => {
    console.log('Database successfully connection.');
    await redisClient.connect();
    app.listen(PORT, () => {
      console.info(`Server runnin on: http://localhost:${PORT}`);
    });
  })
  .catch(async (error) => {
    console.error('FATAL ERROR:', error);
    try {
      await redisClient.quit();
    } catch (e) {
      console.error('Failed to close Redis:', e);
    }
    process.exit(1);
  });
