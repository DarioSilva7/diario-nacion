import { Contact } from './contact.entity';
import { AddressRepository, ContactRepository } from '../../repositories';
import {
  BadRequestError,
  ErrorFactory,
  ConflictError,
  NotFoundError,
} from '../../errors';
import { CreateContactDTO } from './dto/create-contact.dto';
import { isValidBirthdate } from '../../utils/validation.utils';
import { UpdateContactDTO } from './dto/update-contact.dto';
import { UpdateResult } from 'typeorm';
import redisClient from '../../config/redis';
import { BIRTHDAY_CONTACT_CACHE_KEY } from '../../shared/constants';
import { EmailService } from '../../shared/services/email.service';
import { getAge } from '../../utils/getAge.utils';

export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly addressRepository: AddressRepository
  ) {}

  async createContact(
    dto: CreateContactDTO,
    filename: string
  ): Promise<Contact> {
    try {
      const isValid = isValidBirthdate(dto.birthdate);
      if (!isValid)
        throw new BadRequestError('Error en los datos de entrada', {
          birthdate: 'birthdate no cumple con el formato YYYY-MM-DD',
        });
      const existingUser = await this.validateContactByEmail(dto.email);
      if (existingUser)
        throw new ConflictError('Error en los datos de entrada', {
          email: 'Email ya se encuentra registrado',
        });
      const newAddress = await this.addressRepository.createAddress(
        dto.address
      );

      return await this.contactRepository.createContact({
        ...dto,
        profileImage: filename,
        address: newAddress,
      });
    } catch (error: any) {
      if (error.code === '23505') {
        throw ErrorFactory.create('VALIDATION', {
          fieldErrors: { email: ['Email ya registrado'] },
        });
      }
      throw error;
    }
  }
  notify(
    contactsToNotify: { email: string; name: string; birthdate: string }[]
  ): string[] {
    return contactsToNotify.map((el) => {
      const age = getAge(el.birthdate);
      return EmailService.sendCongratulationsEmail(el.email, el.name, age);
    });
  }

  async validateContactByEmail(email: string): Promise<Contact | null> {
    return this.contactRepository.findOneBy({ email });
  }

  async findByEmailOrPhone(term: string): Promise<Contact> {
    const contact = await this.contactRepository.findByEmailOrPhone(
      term.toLowerCase()
    );

    if (!contact) throw new NotFoundError('Contacto', term);
    return contact;
  }

  async findByLocation(state?: string, city?: string): Promise<Contact[]> {
    if (!state && !city) {
      throw new BadRequestError(
        'Se requiere al menos un parámetro (state o city)'
      );
    }
    const normalizedState = state?.trim().toUpperCase();
    const normalizedCity = city?.trim().toUpperCase();

    const contacts = await this.contactRepository.findByLocation(
      normalizedState,
      normalizedCity
    );

    if (contacts.length === 0) {
      throw new NotFoundError(
        'Contactos',
        normalizedState && normalizedCity
          ? `${normalizedState} - ${normalizedCity}`
          : normalizedState || normalizedCity
      );
    }

    return contacts;
  }

  async findContactById(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findContactById(id);

    if (!contact) throw new NotFoundError('Contacto', id);
    return contact;
  }

  async updateContact(
    id: string,
    updateContactDto: UpdateContactDTO
  ): Promise<Contact> {
    const contact = await this.contactRepository.updateContact(
      id,
      updateContactDto
    );

    if (!contact) throw new NotFoundError('Contacto', id);
    return contact;
  }

  async softDeleteContact(id: string): Promise<UpdateResult> {
    const contact = await this.contactRepository.softDeleteContact(id);
    return contact;
  }

  async restoreContact(id: string): Promise<Contact> {
    const { affected } = await this.contactRepository.restoreContact(id);
    if (affected) return this.findContactById(id);
    else
      throw ErrorFactory.create('BAD_REQUEST', {
        message: 'No se pude restaurar el contacto',
        resource: 'Contacto',
      });
  }

  async updateProfileImage(
    contactId: string,
    imagePath: string
  ): Promise<Contact> {
    this.contactRepository.update(contactId, {
      profileImage: imagePath,
    });
    return this.findContactById(contactId);
  }

  async getBirthdayContacts(month: number | null): Promise<Contact[]> {
    const contacts = await this.contactRepository.findBirthdayContacts(month);

    await redisClient.setEx(
      `${BIRTHDAY_CONTACT_CACHE_KEY}_${month || 'current'}`,
      3600,
      JSON.stringify(contacts)
    );

    return contacts;
  }
}
