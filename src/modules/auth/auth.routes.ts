import { Router } from 'express';
import { authContainer } from '../../containers';
const authRouter = Router();

authRouter.post('/register', authContainer.register.bind(authContainer));
authRouter.post('/login', authContainer.login.bind(authContainer));
export default authRouter;
