import { User } from "firebase/auth";
import { ReactNode } from "react";

export interface AuthContextReturnType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

export interface UserType {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface AuthProviderType {
  children: ReactNode;
}

export interface MessageType {
  id: string;
  user: UserType;
  message: string;
  timestamp: unknown;
}

export interface TopLoaderContextReturnType {
  start: () => void;
  stop: () => void;
}
