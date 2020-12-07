import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { useAuth } from '../../hooks/auth';
import { Provider } from '../Dashboard';

import api from '../../services/api';

import AvatarPlaceholder from '../../assets/no_avatar.png';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderName,
  ProviderAvatar,
  Calendar,
  CalendarTitle,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  ScheduleTitle,
  ScheduleSection,
  ScheduleSectionTitle,
  ScheduleContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerID: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const { providerID } = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);

  const [selectedProvider, setSelectedProvider] = useState(providerID);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [providerAvailability, setProviderAvailability] = useState<
    AvailabilityItem[]
  >([]);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedHour, setSelectedHour] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    api.get<Provider[]>('/providers/list').then(response => {
      const { data: providerList } = response;

      let updatedProviderList = providerList;

      if (selectedProvider) {
        const selectedIndex = providerList.findIndex(
          provider => provider.id === selectedProvider,
        );

        const selectedProviderInfo = providerList.splice(selectedIndex, 1);

        updatedProviderList = [...selectedProviderInfo, ...providerList];
      }

      setProviders(updatedProviderList);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function loadAvailability() {
      const URL = `/providers/${selectedProvider}/day-availability`;

      try {
        const { data: availability } = await api.get<AvailabilityItem[]>(URL, {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        });

        setProviderAvailability(availability);
      } catch (err) {
        console.log(err);
      }
    }

    loadAvailability();
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleProviderClick = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleDatePickerToggle = useCallback(() => {
    setShowDatePicker(oldShowValue => !oldShowValue);
  }, []);

  const handleDateChange = useCallback((event, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const parsedDate = useMemo(() => {
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    const dateToShow = `${day}/${month}/${year}`;

    return dateToShow;
  }, [selectedDate]);

  const morningAvailability = useMemo(() => {
    const morningFiltered = providerAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
      }));

    return morningFiltered;
  }, [providerAvailability]);

  const afternoonAvailability = useMemo(() => {
    const afterNoonFiltered = providerAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
      }));

    return afterNoonFiltered;
  }, [providerAvailability]);

  const handleSelectHour = useCallback(hour => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMilliseconds(0);
      date.setMinutes(0);

      const toCreateAppointmentData = {
        provider_id: selectedProvider,
        date,
      };

      await api.post('appointments', toCreateAppointmentData);

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao criar o agendamento, tente novamente.',
      );
    }
  }, [selectedProvider, navigate, selectedHour, selectedDate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              selected={provider.id === selectedProvider}
              onPress={() => handleProviderClick(provider.id)}
            >
              {provider.avatar ? (
                <ProviderAvatar source={{ uri: provider.avatar }} />
              ) : (
                <ProviderAvatar source={AvatarPlaceholder} />
              )}

              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>

      <Calendar>
        <CalendarTitle>Dia selecionado: {parsedDate}</CalendarTitle>

        <OpenDatePickerButton onPress={handleDatePickerToggle}>
          <OpenDatePickerButtonText>
            Selecionar outra data
          </OpenDatePickerButtonText>
        </OpenDatePickerButton>

        {showDatePicker && (
          <DateTimePicker
            display="calendar"
            mode="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        )}
      </Calendar>

      <Schedule>
        <ScheduleTitle>Escolha o horário</ScheduleTitle>

        <ScheduleSection>
          <ScheduleSectionTitle>Manhã</ScheduleSectionTitle>

          <ScheduleContent>
            {morningAvailability.map(({ formattedHour, available, hour }) => (
              <Hour
                available={available}
                key={formattedHour}
                onPress={() => handleSelectHour(hour)}
                enabled={available}
                selected={selectedHour === hour}
              >
                <HourText selected={selectedHour === hour}>
                  {formattedHour}
                </HourText>
              </Hour>
            ))}
          </ScheduleContent>
        </ScheduleSection>

        <ScheduleSection>
          <ScheduleSectionTitle>Tarde</ScheduleSectionTitle>

          <ScheduleContent>
            {afternoonAvailability.map(({ formattedHour, available, hour }) => (
              <Hour
                available={available}
                key={formattedHour}
                onPress={() => handleSelectHour(hour)}
                enabled={available}
                selected={selectedHour === hour}
              >
                <HourText selected={selectedHour === hour}>
                  {formattedHour}
                </HourText>
              </Hour>
            ))}
          </ScheduleContent>
        </ScheduleSection>
      </Schedule>

      <CreateAppointmentButton
        enabled={!!selectedHour}
        onPress={handleCreateAppointment}
      >
        <CreateAppointmentButtonText>Agendar!</CreateAppointmentButtonText>
      </CreateAppointmentButton>
    </Container>
  );
};

export default CreateAppointment;
