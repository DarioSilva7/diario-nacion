import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { errorHandler } from './shared/middlewares/errorHandler.middleware';
import router from './routes';

const app = express();

app.use(helmet({ xXssProtection: true }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

app.use(cors());

app.use(
  morgan('dev', {
    immediate: true,
  })
);

app.use('/uploads', express.static('uploads'));
app.use('/api', router);

app.use(errorHandler);

export default app;
