import { ProfileDesign, SocialLink } from "@/app/types/design";

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendVerifyEmailRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  bio?: string;
  email?: string;
  emailChangeOtp?: string;
  profileImage?: string;
  design?: ProfileDesign;
  socialLinks?: SocialLink[];
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  data: AuthTokensResponse;
  message: string;
}

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  fullName?: string;
  bio?: string;
  profileImage?: string;
  phone: string;
  emailVerified: boolean;
  username?: string;
  createdAt: string;
  design?: ProfileDesign | null;
  socialLinks?: SocialLink[];
}

export interface UserResponse {
  data: User;
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface SessionItem {
  sessionId: string;
  deviceInfo: string;
  createdAt: string;
}

export interface SessionsResponse {
  data: SessionItem[];
  message: string;
}
