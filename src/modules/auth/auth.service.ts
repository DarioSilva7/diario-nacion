import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { User } from '../../entities';
import { UserRepository } from '../user/user.repository';
import { TokenRepository } from './token.repository';
import { BadRequestError, ConflictError, ErrorFactory } from '../../errors';
import { SafeUser } from '../user/user.type';

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository
  ) {}

  async register(userData: RegisterDTO): Promise<User> {
    const existingUser = await this.userRepository.findOneByEmail(
      userData.email
    );
    if (existingUser)
      throw ErrorFactory.create('CONCLICT', {
        message: 'Error en los datos de entrada',
        fieldErrors: {
          email: ['Email ya se encuentra registrado'],
        },
      });

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async login(
    credentials: LoginDTO
  ): Promise<{ user: SafeUser; token: string }> {
    const user = await this.userRepository.findByEmailWithPassword(
      credentials.email
    );

    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw ErrorFactory.create('CONCLICT', {
        message: 'Credenciales invalidas',
      });
    }

    if (!user.isVerified)
      throw ErrorFactory.create('BAD_REQUEST', {
        message: 'Usuario no verificado',
      });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    await this.tokenRepository.save({ token, user });

    const { password, ...safeUser } = user;
    return {
      user: safeUser as SafeUser,
      token,
    };
  }
}
