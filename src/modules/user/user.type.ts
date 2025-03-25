import { User } from './user.entity';

export type SafeUser = Omit<User, 'password'>;
