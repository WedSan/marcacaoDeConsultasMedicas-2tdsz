import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthentication } from '../components/context/AuthenticationContext';
import { RootStackParamList } from '../types/Navigator'; 
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PatientDashboardScreen from './PatientScreen';
import { View, Text } from 'react-native';
import DoctorScreen from './DoctorScreen';
import AdminScreen from './AdminScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuthentication();

  if (loading) {
    return (   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Carregando...</Text>
    </View>); 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {user.role === 'admin' && (
              <Stack.Screen 
                name="AdminDashboard" 
                component={AdminScreen}
                options={{ title: 'Painel Administrativo' }}
              />
            )}
            
            {user.role === 'doctor' && (
              <Stack.Screen 
                name="DoctorDashboard" 
                component={DoctorScreen}
                options={{ title: 'Painel do Médico' }}
              />
            )}
            
            {user.role === 'patient' && (
              <Stack.Screen 
                name="PatientDashboard" 
                component={PatientDashboardScreen}
                options={{ title: 'Painel do Paciente' }}
              />
            )}

            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Início' }}
            />
            <Stack.Screen 
              name="CreateAppointment" 
              component={CreateAppointmentScreen}
              options={{ title: 'Agendar Consulta' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Perfil' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 