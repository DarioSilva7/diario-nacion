import { NextFunction, Request, Response } from 'express';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: RegisterDTO = req.body;
      const user = await this.authService.register(userData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials: LoginDTO = req.body;
      const { user, token } = await this.authService.login(credentials);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      res.json({ success: true, data: { user, token } });
    } catch (error) {
      next(error);
    }
  }
}
