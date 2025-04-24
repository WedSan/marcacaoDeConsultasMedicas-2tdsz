
import {
  LoginCredentials,
  RegisterData,
  AuthenticationResponse,
} from "../types/Authenticatication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUser, User } from "../types/User";
import { fakeDoctors } from "../fake-data/data";

  const keyUser: string = "user";
  const keyToken: string = "token";
  const keyRegisteredUsers: string =  "users";

const fakeAdmin = {
  id: "admin",
  name: "Administrador",
  email: "admin@andrezitosmedic.com",
  role: "admin" as const,
  image: "https://randomuser.me/api/portraits/men/82.jpg",
};


interface RegisteredUser extends BaseUser {
  password: string;
}

let registeredUsers: RegisteredUser[] = [];

export class AuthenticationHandler {

  getAllUsers(): User[] {
    const doctors = fakeDoctors;
    
    const patients = registeredUsers.map(({ password, ...rest }) => rest);
    
    return [...doctors, ...patients.map((patient) => ({ ...patient, role: "patient" as const }))];
  }

  async getAllDoctors(): Promise<User[]> {
    return fakeDoctors;
  }

  async getPatients(): Promise<User[]> {
    const patients = registeredUsers.map(({ password, ...rest }) => rest);
    
    return patients.map((patient)=>({...patient, role: "patient" as const}));
  }

  signIn(credentials: LoginCredentials): AuthenticationResponse | null {
    if (credentials.email === fakeAdmin.email && credentials.password === "abacaxi") {
      return {
        user: fakeAdmin,
        token: "admin-token",
      };
    }

    const doctor = fakeDoctors.find((doc) => doc.email === credentials.email && credentials.password === "pera");
    if (doctor) {
      return {
        user: doctor,
        token: `doctor-token-${doctor.id}`,
      };
    }

    const patient: RegisteredUser | undefined = registeredUsers.find((p) => p.email === credentials.email && credentials.password === p.password);
    if (patient) {
        const { password, ...patientWithoutPassword } = patient;
        return {
          user: patientWithoutPassword as User,
          token: `patient-fake-token-${patient.id}`,
        };
      }

      return null;
    }

  async register(data: RegisterData): Promise<AuthenticationResponse> {
    if (fakeDoctors.some((d) => d.email === data.email) || fakeAdmin.email === data.email || registeredUsers.some((u) => u.email === data.email)) {
      throw new Error("Email already in use");
    }

    const newPatient: RegisteredUser = {
      id: `patient-${registeredUsers.length + 1 }`,
      name: data.name,
      email: data.email,
      role: "patient" as const,
      image: `https://randomuser.me/api/portraits/${registeredUsers.length % 2 === 0 ? "men" : "women"}/${
        registeredUsers.length + 1
      }.jpg`,
      password: data.password,
    };

    registeredUsers.push(newPatient);

    await AsyncStorage.setItem(
      keyRegisteredUsers,
      JSON.stringify(registeredUsers)
    );

    const { password, ...patientWithoutPassword } = newPatient;
    return {
      user: patientWithoutPassword as User,
      token: `patient-token-${newPatient.id}`,
    };
  }

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(keyUser);
    await AsyncStorage.removeItem(keyToken);
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(keyUser);
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error("Fail to get user on the storage:", error);
      return null;
    }
  }

  async loadRegisteredUsers(): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(keyRegisteredUsers);
      if (usersJson) {
        registeredUsers = JSON.parse(usersJson);
      }
    } catch (error) {
      console.error("Failed to load users info:", error);
    }
  }
}
