import React from 'react';
import styled from 'styled-components/native';
import { HeaderContainer, HeaderTitle } from '../components/Header';
import AppointmentForm from '../components/AppointmentForm';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Appointment } from '../types/Appointment';
import { Alert } from 'react-native';

type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

const CreateAppointmentScreen: React.FC<CreateAppointmentScreenProps> = ({ navigation }) => {
   const saveAppointment = async (appointment: Appointment) => {
     try {
       const storedAppointments = await AsyncStorage.getItem('appointments');
       const parsedAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];
       const updatedAppointments = [...parsedAppointments, appointment];
       await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
       Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
     } catch (error) {
       console.error('Erro ao salvar consulta:', error);
       Alert.alert('Erro', 'Não foi possível salvar a consulta.');
     }
   };

  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Agendar Consulta</HeaderTitle>
      </HeaderContainer>

      <Content>
        <AppointmentForm onSubmit={saveAppointment} />
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

export default CreateAppointmentScreen;
