import { QueryFailedError } from 'typeorm';
import { ErrorFactory } from '../errors/error.factory';
import { QueryRunner } from 'typeorm/browser';
import { AppDataSource } from '../config/database';
import { PostgresErrorCode } from './postgres.error';

export class DatabaseWrapper {
  static async execute<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('🚀 ~ DatabaseWrapper ~ error:', error);
      if (error instanceof QueryFailedError) {
        const postgresErrorCodes = Object.values(PostgresErrorCode);
        if (postgresErrorCodes.includes((error as any).code))
          throw ErrorFactory.create('DATABASE', {
            pgCode: (error as any).code,
            query: (error as any).detail,
          });
        throw ErrorFactory.create('DATABASE', {
          pgCode: (error as any).code,
          query: error.message,
        });
      }
      throw error;
    }
  }

  static async transaction<T>(
    operations: (queryRunner: QueryRunner) => Promise<T>
  ): Promise<T> {
    const queryRunner: QueryRunner =
      AppDataSource.getInstance().createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operations(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof QueryFailedError) {
        throw ErrorFactory.create('DATABASE', {
          pgCode: (error as any).code,
          query: error.query,
        });
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
