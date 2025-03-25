import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import { BIRTHDAY_CONTACT_CACHE_KEY } from '../shared/constants';

export const cacheBirthdayContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { month } = req.query;
    const cacheKey = `${BIRTHDAY_CONTACT_CACHE_KEY}_${month || 'current'}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData && JSON.parse(cachedData).length > 0) {
      return res
        .status(200)
        .json({ success: true, data: JSON.parse(cachedData) });
    } else next();
  } catch (error) {
    next(error);
  }
};
