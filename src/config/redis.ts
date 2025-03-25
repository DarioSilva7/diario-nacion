import { createClient } from 'redis';
import { envs } from './envs';

const redisClient = createClient({
  url: envs.redis_url,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.log('Demasiados intentos en REDIS. Conexion terminada');
        return new Error('Demasiados intentos.');
      }
      return 2000;
    },
  },
});

redisClient.on('error', (err) => console.info('🚀 ~ err:', err));
redisClient.on('connect', () => console.log('Redis connection established'));

export default redisClient;
