import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appointment } from "../types/Appointment";

export const loadAppointments = async (): Promise<Appointment[]> => {
  let allAppointments: Appointment[] = [];
  try {
    const storedAppointments = await AsyncStorage.getItem("appointments");
    if (storedAppointments) {
      allAppointments = JSON.parse(storedAppointments);
    }
  } catch (error) {
    console.error("Failed to load the appointments:", error);
  } finally {
    return allAppointments;
  }
};

export const updateAppointmentStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (!storedAppointments) {
        return;
      }
      const allAppointments: Appointment[] = JSON.parse(storedAppointments);
      const updatedAppointments = allAppointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return { ...appointment, status: newStatus };
        }
        return appointment;
      });
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments)); 
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };
