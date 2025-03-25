import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { envs } from './envs';
import { ContactSubscriber } from '../suscribers/contact.suscriber';

export class AppDataSource {
  private static instance: DataSource;

  static getInstance(): DataSource {
    if (!AppDataSource.instance) {
      this.instance = new DataSource({
        type: 'postgres',
        host: envs.db.host,
        port: envs.db.port,
        username: envs.db.user,
        password: envs.db.pass,
        database: envs.db.name,
        entities: ['src/entities/index.ts'],
        subscribers: [ContactSubscriber],
        logging: envs.is_dev,
        synchronize: envs.is_dev,
        migrations: ['src/database/migrations/*{.ts/.js}'],
      });
    }
    return AppDataSource.instance;
  }

  static createEntityManager() {
    return this.getInstance().createEntityManager();
  }

  // static getRepository<T extends ObjectLiteral>(
  //   entity: EntityTarget<T>
  // ): Repository<T> {
  //   return this.getInstance().getRepository(entity);
  // }
}
