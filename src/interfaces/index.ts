import { ReactNode } from "react";

export interface AuthContextReturnType {
  user: UserType | null;
  login: () => void;
  logout: () => void;
}

export interface UserType {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}

export interface AuthProviderType {
  children: ReactNode;
}
