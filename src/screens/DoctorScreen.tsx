import React, { useState } from "react";
import styled from "styled-components/native";
import styles from "../styles/globalStyles";
import { FlatList } from "react-native";
import { Button, Icon } from "react-native-elements";
import { useAuthentication } from "../components/context/AuthenticationContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../types/Navigator";
import theme from "../styles/theme";
import { Header } from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appointment } from "../types/Appointment";
import AppointmentCard from "../components/Appointment/Appointment";
import {
  Container,
  EmptyText,
  LoadingText,
  Content,
} from "../styles/styledComponents";
import { loadAppointments } from "../handlers/appointments";
import { updateAppointmentStatus } from "../handlers/appointments";

type DoctorDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "DoctorDashboard">;
};

const DoctorScreen: React.FC = () => {
  const { user, signOut } = useAuthentication();
  const navigation = useNavigation<DoctorDashboardScreenProps["navigation"]>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setiSLoading] = useState(true);

  const getAppointments = async () => {
    setiSLoading(true);
    let appointments = await loadAppointments();
    if (appointments.length !== 0) {
      appointments = appointments.filter(
        (appointment) => appointment.doctorId === user?.id
      );
    }
    setAppointments(appointments);
    setiSLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getAppointments();
    }, [])
  );

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <Container>
      <AppointmentCard
        appointment={item}
        refreshAppointments={getAppointments}
      />
    </Container>
  );

  return (
    <Container>
      <Header title="Painel do Médico" />
      <Content>
        {isLoading ? (
          <LoadingText>Carregando consultas...</LoadingText>
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta encontrada</EmptyText>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={renderAppointment}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
        <Button
          title="Sair"
          icon={
            <Icon
              name="sign-out-alt"
              type="font-awesome-5"
              color={theme.colors.white}
            />
          }
          buttonStyle={styles.logoutButton}
          onPress={signOut}
        />
      </Content>
    </Container>
  );
};

export default DoctorScreen;
