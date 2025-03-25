import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { Contact } from '../entities';
import redisClient from '../config/redis';

@EventSubscriber()
export class ContactSubscriber implements EntitySubscriberInterface<Contact> {
  listenTo() {
    return Contact;
  }

  async afterInsert(event: InsertEvent<Contact>) {
    const month = new Date(event.entity.birthdate).getMonth() + 1;
    await this.invalidateCacheByMonth(month);
  }
  async afterUpdate(event: UpdateEvent<Contact>) {
    if (!event.databaseEntity) return;

    const oldMonth = new Date(event.databaseEntity.birthdate).getMonth() + 1;

    const newMonth = event.entity?.birthdate
      ? new Date(event.entity.birthdate).getMonth() + 1
      : oldMonth;

    if (oldMonth !== newMonth) {
      await this.invalidateCacheByMonth(oldMonth);
      await this.invalidateCacheByMonth(newMonth);
    } else {
      await this.invalidateCacheByMonth(oldMonth);
    }
  }

  private async invalidateCacheByMonth(month: number): Promise<void> {
    const cacheKey = `birthday_contacts_${month}`;
    await redisClient.del(cacheKey);
    console.log(`Cache invalidada para mes: ${month}`);
  }
}
