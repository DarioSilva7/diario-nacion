import { Request, Response, NextFunction } from 'express';

import { Address, Contact } from '../../../../entities';

import { AddressRepository, ContactRepository } from '../../../../repositories';

import { ContactService } from '../../../../modules/contact/contact.service';

import { ContactController } from '../../../../modules/contact/contact.controller';

import { BadRequestError, NotFoundError } from '../../../../errors';
import { AppDataSource } from '../../../../config/database';

const MockContactRepository = ContactRepository as jest.MockedClass<
  typeof ContactRepository
>;
const MockAddressRepository = AddressRepository as jest.MockedClass<
  typeof AddressRepository
>;

jest.mock('../../../../repositories');
jest.mock('../../../../modules/contact/contact.service');

const mockContactService = ContactService as jest.MockedClass<
  typeof ContactService
>;

describe('ContactController', () => {
  let contactController: ContactController;
  let mockContactService: ContactService;
  let mockContactRepository: ContactRepository;
  let mockAddressRepository: AddressRepository;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockContactRepository = new MockContactRepository(
      Contact,
      AppDataSource.getInstance().createEntityManager()
    );
    mockAddressRepository = new MockAddressRepository(
      Address,
      AppDataSource.getInstance().createEntityManager()
    );

    mockContactService = new ContactService(
      mockContactRepository,
      mockAddressRepository
    );

    contactController = new ContactController(mockContactService);
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('findByLocation', () => {
    it('debe retornar 200 y contactos cuando se encuentran resultados', async () => {
      const mockContacts = [
        {
          id: 'a82bbcb4-58df-47bc-8fa0-8a4c0d246f76',
          name: 'JOHN DOE',
          company: 'Coca-cola',
          profileImage: '/uploads/profile-images/1742771002738.png',
          email: 'john@example.com',
          birthdate: '1988-05-28',
          phonePersonal: '5491112345678',
          phoneWork: null,
          createdDate: '2025-03-24T01:58:40.539Z',
          updatedDate: '2025-03-24T02:03:22.788Z',
          deletedDate: null,
          address: {
            id: '10bd0abe-aedd-411f-b809-b71a81729c2a',
            street: 'Main St 123',
            city: 'BUENOS AIRES',
            state: 'CABA',
          },
        },
        {
          id: 'c0800472-defb-4d48-aed6-2a1442a6211a',
          name: 'JOHN DOE',
          company: 'Coca-cola',
          profileImage: '/uploads/profile-images/1742770544030.png',
          email: 'john@example.com2',
          birthdate: '1988-05-25',
          phonePersonal: '5491112345678',
          phoneWork: null,
          createdDate: '2025-03-24T01:55:21.941Z',
          updatedDate: '2025-03-24T02:20:28.727Z',
          deletedDate: null,
          address: {
            id: '644f18ae-f190-4cba-b31d-f8e122b4fd58',
            street: 'Main St 123',
            city: 'BUENOS AIRES',
            state: 'CABA',
          },
        },
      ] as unknown as Contact[];

      jest
        .spyOn(mockContactService, 'findByLocation')
        .mockResolvedValue(mockContacts);

      mockRequest = {
        query: { state: 'CA', city: 'SF' },
      };

      await contactController.findByLocation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockContactService.findByLocation).toHaveBeenCalledWith(
        'CA',
        'SF'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockContacts,
      });
    });

    it('debe manejar error BadRequest si no se envían state ni city', async () => {
      const error = new BadRequestError(
        'Se requiere al menos un parámetro (state o city)'
      );
      const mockServiceInstance = mockContactService;
      (mockServiceInstance.findByLocation as jest.Mock).mockRejectedValue(
        error
      );

      mockRequest = { query: {} };

      await contactController.findByLocation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockServiceInstance.findByLocation).toHaveBeenCalledWith(
        undefined,
        undefined
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('debe manejar error NotFound si no hay contactos', async () => {
      const error = new NotFoundError('Contactos', 'CA - SF');
      const mockServiceInstance = mockContactService;
      (mockServiceInstance.findByLocation as jest.Mock).mockRejectedValue(
        error
      );

      mockRequest = { query: { state: 'CA', city: 'SF' } };

      await contactController.findByLocation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('debe normalizar parámetros correctamente (controlado por servicio)', async () => {
      const mockServiceInstance = mockContactService;
      (mockServiceInstance.findByLocation as jest.Mock).mockResolvedValue([]);

      mockRequest = { query: { state: '  ca  ', city: '  sF ' } };

      await contactController.findByLocation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockServiceInstance.findByLocation).toHaveBeenCalledWith(
        '  ca  ',
        '  sF '
      );
    });
  });
});
