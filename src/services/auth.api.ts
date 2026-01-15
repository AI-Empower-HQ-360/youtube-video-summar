/**
 * @label Auth API Service
 * @description Frontend API client for authentication and email verification
 */

import { apiClient } from './api.service';

// ============================================
// TYPES
// ============================================

export interface SendVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresAt: string;
    demoCode?: string; // Only in development
  };
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    verifiedAt: string;
  };
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
  retryAfter?: number;
  data?: {
    email: string;
    expiresAt: string;
  };
}

export interface VerificationStatusResponse {
  success: boolean;
  data: {
    email: string;
    verified: boolean;
    verifiedAt: string | null;
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * @label Send Verification Email
 * @description Request OTP code to be sent to user's email
 */
export async function sendVerificationEmail(
  email: string, 
  name?: string
): Promise<SendVerificationResponse> {
  const response = await apiClient.post<SendVerificationResponse>('/auth/send-verification', {
    email,
    name,
  });
  return response.data;
}

/**
 * @label Verify Email Code
 * @description Verify the OTP code entered by user
 */
export async function verifyEmailCode(
  email: string,
  code: string
): Promise<VerifyEmailResponse> {
  const response = await apiClient.post<VerifyEmailResponse>('/auth/verify-email', {
    email,
    code,
  });
  return response.data;
}

/**
 * @label Resend Verification Code
 * @description Request a new OTP code
 */
export async function resendVerificationCode(
  email: string,
  name?: string
): Promise<ResendVerificationResponse> {
  const response = await apiClient.post<ResendVerificationResponse>('/auth/resend-verification', {
    email,
    name,
  });
  return response.data;
}

/**
 * @label Check Verification Status
 * @description Check if an email is verified
 */
export async function checkVerificationStatus(
  email: string
): Promise<VerificationStatusResponse> {
  const response = await apiClient.get<VerificationStatusResponse>(`/auth/verification-status/${encodeURIComponent(email)}`);
  return response.data;
}

// ============================================
// AUTH API OBJECT EXPORT
// ============================================

export const authApi = {
  sendVerificationEmail,
  verifyEmail: verifyEmailCode,
  verifyEmailCode,
  resendVerificationCode,
  checkVerificationStatus,
};

export default authApi;
