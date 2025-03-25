import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import { Contact } from './contact.entity';
import { ContactService } from './contact.service';
import { ApiResponse } from '../../shared/interfaces/apiResponse.interface';
import { CreateContactDTO } from './dto/create-contact.dto';
import { UpdateContactDTO } from './dto/update-contact.dto';
import { BadRequestError, ErrorFactory } from '../../errors';
import { HTTP_STATUS } from '../../shared/constants';
import { isBirthdayToday } from '../../utils/isBirthdayToday.utils';

export class ContactController {
  protected static imageUrlPath = '/uploads/profile-images/';
  constructor(private readonly contactService: ContactService) {}

  private validateMonth(month: string): number {
    const monthNumber = Number(month);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      throw ErrorFactory.create('BAD_REQUEST', {
        message: 'El mes debe ser un número entre 1 y 12',
        resource: 'month',
      });
    }
    return monthNumber;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        throw ErrorFactory.create('BAD_REQUEST', {
          message: 'No se proporcionó una imagen de perfil',
        });

      const { name, email, birthdate, phonePersonal, company, address } =
        req.body;

      const createContactDTO: CreateContactDTO = {
        name,
        email,
        birthdate,
        phonePersonal,
        address,
        company,
      };

      const contact = await this.contactService.createContact(
        createContactDTO,
        ContactController.imageUrlPath + req.file.filename
      );
      const response: ApiResponse<Contact> = {
        success: true,
        data: contact,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async notify(req: Request, res: Response, next: NextFunction) {
    try {
      const contactsBirthdateCurrentMonth =
        await this.contactService.getBirthdayContacts(null);
      const contactsWithBirthdayToday = contactsBirthdateCurrentMonth
        .filter((contact) => {
          try {
            return contact.birthdate && isBirthdayToday(contact.birthdate);
          } catch {
            return false; // Si hay error, descartar el contacto
          }
        })
        .map((contact) => ({
          email: contact.email,
          name: contact.name,
          birthdate: contact.birthdate, // Ya validado que existe
        }));

      const contact = this.contactService.notify(contactsWithBirthdayToday);
      const response: ApiResponse<string[]> = {
        success: true,
        data: contact,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOneContactByEmailOrPhone(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { term } = req.params;
      const contact = await this.contactService.findByEmailOrPhone(term);
      const response: ApiResponse<Contact> = {
        success: true,
        data: contact,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async showOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const contact = await this.contactService.findContactById(id);
      const response: ApiResponse<Contact> = {
        success: true,
        data: contact,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async findByLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { state, city } = req.query;
      const contact = await this.contactService.findByLocation(
        state?.toString(),
        city?.toString()
      );
      const response: ApiResponse<Contact[]> = {
        success: true,
        data: contact,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contact = await this.contactService.updateContact(
        id,
        req.body as UpdateContactDTO
      );
      const response: ApiResponse<Contact> = {
        success: true,
        data: contact,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contact = await this.contactService.softDeleteContact(id);
      const response: ApiResponse<number> = {
        success: true,
        data: contact.affected,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async restore(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contact = await this.contactService.restoreContact(id);
      const response: ApiResponse<Contact> = {
        success: true,
        data: contact,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateProfileImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!req.file) {
        throw ErrorFactory.create('BAD_REQUEST', {
          message: 'No se proporcionó una imagen',
        });
      }

      const currentContact = await this.contactService.findContactById(id);
      if (currentContact.profileImage) {
        await fs.promises.unlink(
          path.join(__dirname, '../../../', currentContact.profileImage)
        );
      }
      const fileName = ContactController.imageUrlPath + req.file.filename;

      await fs.promises.rename(
        req.file.path,
        path.join(__dirname, '../../../', fileName)
      );

      const updatedContact = await this.contactService.updateProfileImage(
        id,
        fileName
      );
      const response: ApiResponse<Contact> = {
        success: true,
        data: updatedContact,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBirthdayContacts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const validatedMonth = req.query.month
        ? this.validateMonth(String(req.query.month))
        : null;

      const contacts = await this.contactService.getBirthdayContacts(
        validatedMonth
      );
      const response: ApiResponse<Contact[]> = {
        success: true,
        data: contacts,
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
