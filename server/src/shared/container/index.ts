import { container } from 'tsyringe';

import '@modules/users/providres';
import '@shared/container/providers';

import IAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/iUsersRepository';

import iUserTokensRepository from '@modules/users/repositories/iUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';

import iNotificationsRepository from '@modules/notifications/repositories/iNotificationsRepository';
import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';

container.registerSingleton<IAppointmentRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<iUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<iNotificationsRepository>(
  'NotificationRepository',
  NotificationRepository,
);
