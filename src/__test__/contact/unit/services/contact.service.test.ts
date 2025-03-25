import { UpdateResult } from 'typeorm';
import { ContactService } from '../../../../modules/contact/contact.service';
import { AddressRepository, ContactRepository } from '../../../../repositories';
import { Contact } from '../../../../entities';
import { ErrorFactory } from '../../../../errors';

describe('ContactService', () => {
  let contactService: ContactService;
  let mockContactRepository: jest.Mocked<ContactRepository>;
  let mockAddressRepository: jest.Mocked<AddressRepository>;

  beforeEach(() => {
    mockContactRepository = {
      restoreContact: jest.fn(),
      findContactById: jest.fn(),
    } as unknown as jest.Mocked<ContactRepository>;

    mockAddressRepository = {} as jest.Mocked<AddressRepository>;

    contactService = new ContactService(
      mockContactRepository,
      mockAddressRepository
    );
  });

  describe('restoreContact', () => {
    it('debe restaurar un contacto exitosamente', async () => {
      const mockId = 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8';
      const mockContact = { id: mockId, name: 'John Doe' } as Contact;
      const mockUpdateResult = { affected: 1 } as UpdateResult;

      mockContactRepository.restoreContact.mockResolvedValue(mockUpdateResult);
      mockContactRepository.findContactById.mockResolvedValue(mockContact);

      const result = await contactService.restoreContact(mockId);

      expect(mockContactRepository.restoreContact).toHaveBeenCalledWith(mockId);
      expect(mockContactRepository.findContactById).toHaveBeenCalledWith(
        mockId
      );
      expect(result).toEqual(mockContact);
    });

    it('debe lanzar error cuando no se afecta ningún registro', async () => {
      const mockId = 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8';
      const mockUpdateResult = { affected: 0 } as UpdateResult;

      mockContactRepository.restoreContact.mockResolvedValue(mockUpdateResult);

      await expect(contactService.restoreContact(mockId)).rejects.toThrow(
        ErrorFactory.create('BAD_REQUEST', {
          message: 'No se pude restaurar el contacto',
          resource: 'Contacto',
        })
      );

      expect(mockContactRepository.restoreContact).toHaveBeenCalledWith(mockId);
      expect(mockContactRepository.findContactById).not.toHaveBeenCalled();
    });

    it('debe lanzar error cuando no encuentra el contacto después de restaurar', async () => {
      const mockId = 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8';
      const mockUpdateResult = { affected: 1 } as UpdateResult;

      mockContactRepository.restoreContact.mockResolvedValue(mockUpdateResult);
      mockContactRepository.findContactById.mockRejectedValue(
        new Error('Contacto no encontrado')
      );

      await expect(contactService.restoreContact(mockId)).rejects.toThrow();

      expect(mockContactRepository.restoreContact).toHaveBeenCalledWith(mockId);
      expect(mockContactRepository.findContactById).toHaveBeenCalledWith(
        mockId
      );
    });
  });
});
