export interface Appointment  {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  description: string;
  patientName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}