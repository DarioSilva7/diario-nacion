import { Between, Repository, UpdateResult } from 'typeorm';
import { Contact } from './contact.entity';
import { DatabaseWrapper } from '../../database/database.wrapper';
import { UpdateContactDTO } from './dto/update-contact.dto';
import { NotFoundError } from '../../errors';
import { Address } from '../address/address.entity';

export class ContactRepository extends Repository<Contact> {
  async createContact(contactData: {
    profileImage: string;
    address: Address;
    name: string;
    email: string;
    birthdate: string;
    phonePersonal: string;
  }): Promise<Contact> {
    return DatabaseWrapper.execute(
      async () => this.save(contactData),
      'createContact'
    );
  }

  async findByEmailOrPhone(term: string): Promise<Contact | null> {
    const normalizedTerm = term.toLowerCase().replace(/[^\d]/g, '');
    return this.createQueryBuilder('contact')
      .where(
        `
      contact.email = :emailTerm OR
      contact.phone_personal = :phoneTerm OR
      contact.phone_work = :phoneTerm
    `,
        {
          emailTerm: term,
          phoneTerm: normalizedTerm,
        }
      )
      .getOne();
  }

  async findByLocation(state?: string, city?: string): Promise<Contact[]> {
    const query = this.createQueryBuilder('contact').innerJoinAndSelect(
      'contact.address',
      'address'
    );

    const normalizedState = state?.trim().toUpperCase();
    const normalizedCity = city?.trim().toUpperCase();

    if (normalizedState && normalizedCity) {
      query.where('address.state = :state AND address.city = :city', {
        state: normalizedState,
        city: normalizedCity,
      });
    } else if (normalizedState) {
      query.where('address.state = :state', { state: normalizedState });
    } else if (normalizedCity) {
      query.where('address.city = :city', { city: normalizedCity });
    }

    const data = await query.getMany();
    return data;
  }

  async findContactById(id: string): Promise<Contact | null> {
    return DatabaseWrapper.execute(
      async () => this.findOneBy({ id }),
      'finContactById'
    );
  }

  async updateContact(
    id: string,
    updateContactDto: UpdateContactDTO
  ): Promise<Contact | null> {
    const contact = await this.preload({ id, ...updateContactDto });
    if (!contact) throw new NotFoundError(id, 'contact');

    return DatabaseWrapper.execute(
      async () => this.save(contact),
      'finContactById'
    );
  }

  async softDeleteContact(id: string): Promise<UpdateResult> {
    const result = await DatabaseWrapper.execute(
      async () => this.softDelete(id),
      'softDeleteContact'
    );
    return result;
  }

  async restoreContact(id: string): Promise<UpdateResult> {
    const result = await DatabaseWrapper.execute(
      async () => this.restore(id),
      'restoreContact'
    );

    return result;
  }

  async findBirthdayContacts(month: number | null): Promise<Contact[]> {
    const birthdateMonth = month || new Date().getMonth() + 1;
    console.log(
      '🚀 ~ ContactRepository ~ findBirthdayContacts ~ birthdateMonth:',
      birthdateMonth
    );
    return this.createQueryBuilder('contact')
      .innerJoinAndSelect('contact.address', 'address')
      .where(`EXTRACT(MONTH FROM contact.birthdate) = :birthdateMonth`, {
        birthdateMonth,
      })
      .getMany();
  }
}
