import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories';
import { TokenRepository } from '../modules/auth/token.repository';
import { ErrorFactory } from '../errors';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
      throw ErrorFactory.create('FORBIDDEN', {
        message: 'Acceso no autorizado',
      });

    interface JwtPayload {
      userId: string;
      [key: string]: any;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const userRepository = new UserRepository();
    const user = await userRepository.findUserWithTokens(decoded.userId);

    if (!user)
      throw ErrorFactory.create('NOT_FOUND', {
        message: 'Usuario no encontrado',
      });

    const tokenRepository = new TokenRepository();
    const tokenExists = await tokenRepository.tokenExists(user.id, token);

    if (!tokenExists)
      throw ErrorFactory.create('BAD_REQUEST', {
        message: 'Token inválido o expirado',
      });

    const { password, ...userWithoutPassword } = user;
    // req.user = userWithoutPassword;
    Object.assign(req, {
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
      },
    });
    next();
  } catch (error) {
    next(error);
  }
};
