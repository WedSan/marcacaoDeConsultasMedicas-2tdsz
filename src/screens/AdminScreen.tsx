import React, { useState } from "react";
import { FlatList, Alert } from "react-native";
import { Button, Icon } from "react-native-elements";
import { useAuthentication } from "../components/context/AuthenticationContext";
import { useFocusEffect } from "@react-navigation/native";
import { Appointment } from "../types/Appointment";
import {
  loadAppointments,
} from "../handlers/appointments";
import {
  Container,
  Content,
  EmptyText,
  LoadingText,
} from "../styles/styledComponents";
import AppointmentCard from "../components/Appointment/Appointment";
import { Header } from "../components/Header";
import theme from "../styles/theme";

export const AdminScreen: React.FC = () => {
  const { signOut } = useAuthentication();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAppointments = async () => {
    setIsLoading(true);
    let appointments = await loadAppointments();
    setAppointments(appointments);
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getAppointments();
    }, [])
  );

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <AppointmentCard
      appointment={item}
      refreshAppointments={getAppointments}
    />
  );

  return (
    <Container>
      <Header title="Painel Administrativo" />
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
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.error,
            borderRadius: 8,
            paddingVertical: 12,
            marginTop: 20,
          }}
          onPress={signOut}
        />
      </Content>
    </Container>
  );
};

export default AdminScreen;
