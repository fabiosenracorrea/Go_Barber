import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';

export default interface iAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
