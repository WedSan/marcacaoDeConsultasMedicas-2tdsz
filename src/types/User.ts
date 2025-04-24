export type UserFunction = "admin" | "doctor" | "patient";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserFunction;
  image: string;
}

export interface Admin extends BaseUser {
  role: "admin";
}

export interface Patient extends BaseUser {
  role: "patient";
}

export interface Doctor extends BaseUser {
  role: "doctor";
  specialty: string;
}

export type User = Admin | Doctor | Patient;
