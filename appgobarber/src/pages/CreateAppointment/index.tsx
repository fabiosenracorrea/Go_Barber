import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

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
} from './styles';

interface RouteParams {
  providerID: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { goBack } = useNavigation();
  const { providerID } = route.params as RouteParams;
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerID);

  const { user } = useAuth();

  useEffect(() => {
    api.get<Provider[]>('/providers/list').then(response => {
      const { data: providerList } = response;

      const selectedIndex = providerList.findIndex(
        provider => provider.id === selectedProvider,
      );

      const selectedProviderInfo = providerList.splice(selectedIndex, 1);

      const updatedProviderList = [...selectedProviderInfo, ...providerList];

      setProviders(updatedProviderList);
    });
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleProviderClick = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

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
    </Container>
  );
};

export default CreateAppointment;
