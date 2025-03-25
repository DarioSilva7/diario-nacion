import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';
import { DatabaseWrapper } from '../../database/database.wrapper';
import { AppDataSource } from '../../config/database';

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.createEntityManager());
  }
  async createUser(userData: {
    email: string;
    password: string;
  }): Promise<User> {
    return DatabaseWrapper.execute(
      async () => this.save(userData),
      'createUser'
    );
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
      select: ['id', 'email', 'isVerified'],
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findUserWithTokens(id: string): Promise<User | null> {
    return this.findOne({
      where: { id },
      relations: ['tokens'],
    });
  }
}
