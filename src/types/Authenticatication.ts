import { User } from "./User";

export interface LoginCredentials {
    email: string;
    password: string;
}
  
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    user: User;
    token: string;
}


export interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    signOut: () => Promise<void>;
} 