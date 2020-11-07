import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import iFindAllInMonthDTO from '@modules/appointments/dtos/iFindAllInMonthDTO';
import iFindAllInDayDTO from '@modules/appointments/dtos/iFindAllInDayDTO';

export default interface iAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(data: iFindAllInMonthDTO): Promise<Appointment[]>;
  findAllInDayFromProvider(data: iFindAllInDayDTO): Promise<Appointment[]>;
}
