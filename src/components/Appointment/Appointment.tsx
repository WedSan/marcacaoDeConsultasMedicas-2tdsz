import { Appointment } from "../../types/Appointment";
import styles from "../../styles/globalStyles";
import styled from "styled-components/native";
import theme from "../../styles/theme";
import { updateAppointmentStatus } from "../../handlers/appointments";
import { Button, View } from "react-native";
import { useAuthentication } from "../context/AuthenticationContext";

interface AppointmentProps {
  appointment: Appointment;
  refreshAppointments: () => void;
}

const AppointmentCard: React.FC<AppointmentProps> = ({
  appointment,
  refreshAppointments,
}) => {
  const { user } = useAuthentication();

  const onUpdateStatus = (
    appointmentId: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    updateAppointmentStatus(appointmentId, newStatus);
    refreshAppointments();
  };

  return (
    <AppointmentContainer>
      <AppointmentInfo>
        {user?.role === "admin" && (
            <View>
                <Id>Consulta Id: {appointment.id}</Id>
                <DoctorId>Id do Doutor: {appointment.doctorId}</DoctorId>
                <PatientId>Id do Paciente: {appointment.patientId}</PatientId>
            </View>
        )}

        <PatientName>Paciente: {appointment.patientName}</PatientName>
        <DoctorName>Médico: {appointment.doctorName}</DoctorName>
        <Specialty>Especialidade médica: {appointment.specialty}</Specialty>

        <DateTime>{`${appointment.date} às ${appointment.time}`}</DateTime>
      </AppointmentInfo>
      <Actions>
        {appointment.status === "pending" ? (
          <>
            <Button
              title="Confirmar"
              onPress={() => onUpdateStatus(appointment.id, "confirmed")}
              color={styles.confirmButton.backgroundColor}
            />
            <Button
              title="Cancelar"
              onPress={() => onUpdateStatus(appointment.id, "cancelled")}
              color={styles.cancelButton.backgroundColor}
            />
          </>
        ) : (
          <StatusBadge status={appointment.status}>
            <StatusText>
              {appointment.status === "confirmed" ? "Confirmada" : "Cancelada"}
            </StatusText>
          </StatusBadge>
        )}
      </Actions>
    </AppointmentContainer>
  );
};

export default AppointmentCard;

const AppointmentContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 10px;
  padding: ${theme.spacing.medium}px;
  margin-bottom: ${theme.spacing.medium}px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  shadow-offset: 0px 2px;
  flex-direction: row;
  justify-content: space-between;
  align-appointments: center;
`;

const AppointmentInfo = styled.View`
  flex: 1;
`;

const PatientName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const Id = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const DoctorId = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const PatientId = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const Specialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.textLight};
  margin-top: 4px;
`;

const DateTime = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;

const Actions = styled.View`
  flex-direction: row;
  align-appointments: center;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.small};
`;

// const StyledButton = styled(Button).attrs(()=>({
//   buttonStyle: {
//     borderRadius: 4,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   titleStyle: {
//     fontSize: 14,
//   }
// }))

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${(props) =>
    props.status === "confirmed" ? theme.colors.success : theme.colors.error}20;
  padding: 6px 12px;
  border-radius: 20px;
`;

const StatusText = styled.Text`
  color: ${(props) =>
    props.children === "Confirmada"
      ? theme.colors.success
      : theme.colors.error};
  font-size: ${theme.typography.caption.fontSize}px;
  font-weight: bold;
`;
