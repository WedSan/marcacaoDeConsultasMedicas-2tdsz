import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button, Input, Text } from 'react-native-elements';
import { Platform, View, TouchableOpacity, Alert } from 'react-native';
import theme from '../styles/theme';
import { fakeDoctors as doctors, fakeDoctors } from '../fake-data/data'; 
import * as yup from 'yup';
import { Formik } from 'formik';
import { Appointment } from '../types/Appointment';
import { useAuthentication } from './context/AuthenticationContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigator';
import { useNavigation } from '@react-navigation/native';

interface AppointmentFormProps {
   onSubmit: (appointment: Appointment) => Promise<void>;
};

type AppointmenFormNavigationProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

const validationSchema = yup.object().shape({
  doctorId: yup.string().required('Selecione um médico.'),
  date: yup
    .string()
    .required('A data é obrigatória.')
    .matches(
      /^(\d{2})\/(\d{2})\/(\d{4})$/,
      'A data deve estar no formato DD/MM/AAAA.'
    )
    .test('valid-date', 'Insira uma data válida.', (value) => {
      if (!value) return false;
      const [day, month, year] = value.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
      return date >= today && date <= maxDate;
    }),
  time: yup.string().required('Selecione um horário.'),
  description: yup
    .string()
    .required('A descrição é obrigatória.')
    .min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
});

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const navigation = useNavigation<AppointmenFormNavigationProps["navigation"]>();
  const timeSlots = generateTimeSlots();
  
  const {user} = useAuthentication()

  return (
    <Formik
      initialValues={{
        doctorId: '',
        date: '',
        time: '',
        description: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        const currentDoctor = fakeDoctors.find(d=>d.id == values.doctorId)
        const newAppointment = {
          id: Math.random().toString(36).substr(2, 9),
          doctorId: values.doctorId,
          doctorName: currentDoctor!.name,
          patientId: user!.id,
          patientName: user!.name,
          specialty: currentDoctor!.specialty!,
          status: 'pending' as 'pending',
          date: values.time,
          time: values.time,
          description: values.description,
        };
        resetForm();
        navigation.navigate("Home");
        onSubmit(newAppointment);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <Container>
          <Title>Selecione o Médico</Title>
          <DoctorList>
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                selected={values.doctorId === doctor.id}
                onPress={() => setFieldValue('doctorId', doctor.id)}
              >
                <DoctorImage source={{ uri: doctor.image }} />
                <DoctorInfo>
                  <DoctorName>{doctor.name}</DoctorName>
                  <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                </DoctorInfo>
              </DoctorCard>
            ))}
          </DoctorList>
          {touched.doctorId && errors.doctorId && (
            <Text style={{ color: 'red' }}>{errors.doctorId}</Text>
          )}

          <Title>Data e Hora</Title>
          <Input
            placeholder="Data (DD/MM/AAAA)"
            value={values.date}
            onChangeText={handleChange('date')}
            onBlur={handleBlur('date')}
            keyboardType="numeric"
            maxLength={10}
            containerStyle={InputContainer}
            errorMessage={touched.date && typeof errors.date === 'string' ? errors.date : undefined}
          />

          <TimeSlotsContainer>
            <TimeSlotsTitle>Horários Disponíveis:</TimeSlotsTitle>
            <TimeSlotsGrid>
              {timeSlots.map((time) => {
                const isAvailable = true; 
                return (
                  <TimeSlotButton
                    key={time}
                    selected={values.time === time}
                    disabled={!isAvailable}
                    onPress={() => isAvailable && setFieldValue('time', time)}
                  >
                    <TimeSlotText
                      selected={values.time === time}
                      disabled={!isAvailable}
                    >
                      {time}
                    </TimeSlotText>
                  </TimeSlotButton>
                );
              })}
            </TimeSlotsGrid>
          </TimeSlotsContainer>
          {touched.time && errors.time && (
            <Text style={{ color: 'red' }}>{errors.time}</Text>
          )}

          <Input
            placeholder="Descrição da consulta"
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            multiline
            numberOfLines={4}
            containerStyle={InputContainer}
            errorMessage={
              touched.description && errors.description
                ? errors.description
                : undefined
            }
          />

          <SubmitButton
            title="Agendar Consulta"
            onPress={handleSubmit as any}
            buttonStyle={{
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              padding: 12,
              marginTop: 20,
            }}
          />
        </Container>
      )}
    </Formik>
  );
};

const Container = styled.View`
  padding: ${theme.spacing.medium}px;
`;

const Title = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.medium}px;
`;

const DoctorList = styled.ScrollView`
  margin-bottom: ${theme.spacing.large}px;
`;

const DoctorCard = styled(TouchableOpacity)<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.medium}px;
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.white};
  border-radius: 8px;
  margin-bottom: ${theme.spacing.medium}px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

const DoctorInfo = styled.View`
  flex: 1;
`;

const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
`;

const TimeSlotsContainer = styled.View`
  margin-bottom: ${theme.spacing.large}px;
`;

const TimeSlotsTitle = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

const TimeSlotsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.spacing.small}px;
`;

const TimeSlotButton = styled(TouchableOpacity)<{ selected: boolean; disabled: boolean }>`
  background-color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.background 
      : props.selected 
        ? theme.colors.primary 
        : theme.colors.white};
  padding: ${theme.spacing.small}px ${theme.spacing.medium}px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.background 
      : props.selected 
        ? theme.colors.primary 
        : theme.colors.text};
  opacity: ${(props: { disabled: boolean }) => props.disabled ? 0.5 : 1};
`;

const TimeSlotText = styled(Text)<{ selected: boolean; disabled: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.text 
      : props.selected 
        ? theme.colors.white 
        : theme.colors.text};
`;

const InputContainer = {
   marginBottom: theme.spacing.medium,
   backgroundColor: theme.colors.white,
   borderRadius: 8,
   paddingHorizontal: theme.spacing.medium,
};

const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.large}px;
`;

export default AppointmentForm;