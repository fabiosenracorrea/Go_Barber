import { uuid } from 'uuidv4';
import { getMonth, getYear, getDate } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

import iAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import iFindAllInMonthDTO from '@modules/appointments/dtos/iFindAllInMonthDTO';
import iFindAllInDayDTO from '@modules/appointments/dtos/iFindAllInDayDTO';

class AppointmentsRepository implements iAppointmentRepository {
  public appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const existentAppointment = this.appointments.find(
      appointment => appointment.date.getTime() === date.getTime(),
    );

    return existentAppointment;
  }

  public async findAllInMonthFromProvider({
    month,
    provider_id,
    year,
  }: iFindAllInMonthDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    month,
    day,
    provider_id,
    year,
  }: iFindAllInDayDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year &&
        getDate(appointment.date) === day,
    );

    return appointments;
  }

  public async create({
    date,
    provider_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
