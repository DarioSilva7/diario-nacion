import { AppDataSource } from '../config/database';
import { Address, Contact, Token, User } from '../entities';
import { AuthController } from '../modules/auth/auth.controller';
import { AuthService } from '../modules/auth/auth.service';
import { TokenRepository } from '../modules/auth/token.repository';
import { ContactController } from '../modules/contact/contact.controller';
import { ContactService } from '../modules/contact/contact.service';
import {
  AddressRepository,
  ContactRepository,
  UserRepository,
} from '../repositories';

const contactRepository = new ContactRepository(
  Contact,
  AppDataSource.getInstance().createEntityManager()
);
const addressRepository = new AddressRepository(
  Address,
  AppDataSource.getInstance().createEntityManager()
);
const contactService = new ContactService(contactRepository, addressRepository);

export const contactContainer = new ContactController(contactService);

const tokenRepository = new TokenRepository();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository, tokenRepository);

export const authContainer = new AuthController(authService);
