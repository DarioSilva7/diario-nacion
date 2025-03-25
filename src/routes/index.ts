import { Request, Response, Router } from 'express';
import rateLimit from 'express-rate-limit';
import contactRouter from '../modules/contact/contact.routes';
import authRouter from '../modules/auth/auth.routes';

const router = Router();

router.get('/status', (_req: Request, res: Response) => {
  res.send('ONLINE');
});

router.use(
  '/auth',
  rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 5,
  }),
  authRouter
);
router.use('/contacts', contactRouter);

export default router;
