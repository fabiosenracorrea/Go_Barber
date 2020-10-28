import { ObjectID } from 'mongodb';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

import iNotificationsRepository from '@modules/notifications/repositories/iNotificationsRepository';

import iCreateNotificationDTO from '@modules/notifications/dtos/iCreateNotificationDTO';

class FakeNotificationRepository implements iNotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: iCreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationRepository;
