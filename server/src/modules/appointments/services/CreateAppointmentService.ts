import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

import IAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import iNotificationsRepository from '@modules/notifications/repositories/iNotificationsRepository';

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('NotificationRepository')
    private notificationRepository: iNotificationsRepository,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    const parsedDate = startOfHour(date);

    const EARLIEST_HOUR = 8;
    const LATEST_HOUR = 17;

    if (
      getHours(parsedDate) < EARLIEST_HOUR ||
      getHours(parsedDate) > LATEST_HOUR
    ) {
      throw new AppError(
        'You can only create an appointment between 8am and 5pm.',
      );
    }

    const currentDate = new Date(Date.now());
    const dateRequestedIsInThePast = isBefore(parsedDate, currentDate);

    if (dateRequestedIsInThePast) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    const appointmentInSameDate = await this.appointmentsRepository.findByDate(
      parsedDate,
    );

    if (appointmentInSameDate) {
      throw new AppError('Date already has an appointment.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: parsedDate,
    });

    const dateFormatted = format(parsedDate, "dd/MM/yyyy 'às' HH:mm");

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
