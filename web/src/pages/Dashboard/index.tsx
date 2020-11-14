import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { isToday, format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-day-picker/lib/style.css';

import Header from '../../components/Header';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Appointment,
  Section,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface AppointmentItem {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const [dailyAppointments, setDailyAppointments] = useState<AppointmentItem[]>(
    [],
  );

  const {
    user: { id },
  } = useAuth();

  useEffect(() => {
    api
      .get<AppointmentItem[]>('/providers/appointments', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const formattedAppointments = response.data.map(appointment => {
          const appDate = parseISO(appointment.date);
          const hourFormatted = format(appDate, 'HH:mm');

          return {
            ...appointment,
            hourFormatted,
          };
        });

        setDailyAppointments(formattedAppointments);
      });
  }, [selectedDate]);

  useEffect(() => {
    api
      .get(`/providers/${id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, id]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const dateFormated = new Date(year, month, monthDay.day);

        return dateFormated;
      });

    return dates;
  }, [monthAvailability, currentMonth]);

  const selectedDateIsToday = useMemo(() => {
    return isToday(selectedDate);
  }, [selectedDate]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    const morningApps = dailyAppointments.filter(appointment => {
      const parsedDateHours = parseISO(appointment.date).getHours();

      const appointmentIsInTheMorning = parsedDateHours < 12;

      return appointmentIsInTheMorning;
    });

    return morningApps;
  }, [dailyAppointments]);

  const afternoonAppointments = useMemo(() => {
    const afternoonApps = dailyAppointments.filter(appointment => {
      const parsedDateHours = parseISO(appointment.date).getHours();

      const appointmentIsInTheAfternoon = parsedDateHours >= 12;

      return appointmentIsInTheAfternoon;
    });

    return afternoonApps;
  }, [dailyAppointments]);

  return (
    <Container>
      <Header />

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {selectedDateIsToday && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          <NextAppointment>
            <strong>Agendamento a seguir</strong>

            <div>
              <img
                src="https://avatars1.githubusercontent.com/u/61704246?s=460&u=d54f9c2edf7ae61a103a92486928b6c71034fee6&v=4"
                alt="cliente"
              />

              <strong>Fábio Corrêa</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
