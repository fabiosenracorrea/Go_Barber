import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

import iCreateNotificationDTO from '@modules/notifications/dtos/iCreateNotificationDTO';

export default interface iNotificationsRepository {
  create(data: iCreateNotificationDTO): Promise<Notification>;
}
