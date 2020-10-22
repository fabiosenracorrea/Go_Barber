import { uuid } from 'uuidv4';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

import iAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';

class AppointmentsRepository implements iAppointmentRepository {
  public appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const existentAppointment = this.appointments.find(
      appointment => appointment.date.getTime() === date.getTime(),
    );

    return existentAppointment;
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
