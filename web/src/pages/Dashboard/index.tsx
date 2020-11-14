import React, { useState } from 'react';
import { FiClock } from 'react-icons/fi';

import Header from '../../components/Header';

import {
  Container,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Appointment,
  Section,
} from './styles';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Container>
      <Header />

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>

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

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars1.githubusercontent.com/u/61704246?s=460&u=d54f9c2edf7ae61a103a92486928b6c71034fee6&v=4"
                  alt="cliente"
                />

                <strong>Fábio Corrêa</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars1.githubusercontent.com/u/61704246?s=460&u=d54f9c2edf7ae61a103a92486928b6c71034fee6&v=4"
                  alt="cliente"
                />

                <strong>Fábio Corrêa</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars1.githubusercontent.com/u/61704246?s=460&u=d54f9c2edf7ae61a103a92486928b6c71034fee6&v=4"
                  alt="cliente"
                />

                <strong>Fábio Corrêa</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
