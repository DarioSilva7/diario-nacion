import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { DatabaseWrapper } from '../../database/database.wrapper';
import { User } from '../user/user.entity';
import { AppDataSource } from '../../config/database';

export class TokenRepository extends Repository<Token> {
  constructor() {
    super(Token, AppDataSource.createEntityManager());
  }
  async createToken(tokenData: { token: string; user: User }): Promise<Token> {
    return DatabaseWrapper.execute(
      async () => this.save(tokenData),
      'createToken'
    );
  }

  async tokenExists(userId: string, token: string): Promise<boolean> {
    const found = await this.findOne({
      where: {
        user: { id: userId },
        token,
      },
    });
    return !!found;
  }
}
