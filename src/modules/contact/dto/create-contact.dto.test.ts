import { validate } from 'class-validator';
import { CreateContactDTO } from './create-contact.dto';
import { Address } from '../../address/address.entity';

describe('create-contact.dto', () => {
  it('Debe ser válido con datos correctos', async () => {
    const address = new Address();
    address.street = 'Main St 123';
    address.city = 'BUENOS AIRES';
    address.state = 'CABA';

    const dto = new CreateContactDTO();
    dto.name = 'John Doe';
    dto.email = 'johnq@mail.com';
    dto.phonePersonal = '+54987654321';
    dto.phoneWork = '+54912345678';
    dto.company = 'Diario La Nacion';
    dto.birthdate = '2000-03-15';

    dto.address = address;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
