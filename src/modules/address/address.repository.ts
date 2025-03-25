import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { DatabaseWrapper } from '../../database/database.wrapper';
import { CreateAddressDTO } from './dto/create-address.dto';

export class AddressRepository extends Repository<Address> {
  async createAddress(addressData: CreateAddressDTO): Promise<Address> {
    return DatabaseWrapper.execute(
      async () => this.save(addressData),
      'createAddress'
    );
  }
}
