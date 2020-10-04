import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import AuthRotes from './auth.routes';
import LoggedRoutes from './app.routes';

import { useAuth } from '../hooks/auth';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return user ? <LoggedRoutes /> : <AuthRotes />;
};

export default AppRoutes;
