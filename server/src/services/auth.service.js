/**
 * @label Auth Service
 * @description Service for authentication and email verification logic
 */

import crypto from 'crypto';
import nodemailer from 'nodemailer';

// ============================================
// IN-MEMORY STORE (Replace with database in production)
// ============================================

/**
 * Store for verification codes
 * In production, use Redis or database
 */
const verificationStore = new Map();

/**
 * Store for verified emails
 */
const verifiedEmails = new Set();

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  CODE_LENGTH: 6,
  CODE_EXPIRY_MINUTES: 10,
  RESEND_COOLDOWN_SECONDS: 60,
  MAX_ATTEMPTS: 5,
};

// ============================================
// EMAIL TRANSPORTER SETUP
// ============================================

/**
 * Create nodemailer transporter
 * Supports Gmail SMTP or other SMTP providers
 * 
 * For Gmail, you need to:
 * 1. Enable 2-Step Verification in your Google Account
 * 2. Generate an App Password at https://myaccount.google.com/apppasswords
 * 3. Use that App Password as SMTP_PASS
 */
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  if (!smtpUser || !smtpPass) {
    console.warn('[EMAIL] SMTP credentials not configured. Email sending disabled.');
    return null;
  }
  
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  
  console.log(`[EMAIL] Transporter configured: ${smtpHost}:${smtpPort}`);
  return transporter;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * @label Generate OTP Code
 * @description Generate a random numeric OTP code
 */
function generateOTPCode(length = CONFIG.CODE_LENGTH) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * @label Hash Code
 * @description Hash the verification code for secure storage
 */
function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * @label Send Email
 * @description Send email using Nodemailer with Gmail SMTP
 */
async function sendEmail(to, subject, htmlBody, textBody) {
  const emailTransporter = getTransporter();
  
  if (!emailTransporter) {
    // Fallback: log to console if no SMTP configured
    console.log('==========================================');
    console.log(`[EMAIL FALLBACK] SMTP not configured!`);
    console.log(`[EMAIL FALLBACK] To: ${to}`);
    console.log(`[EMAIL FALLBACK] Subject: ${subject}`);
    console.log(`[EMAIL FALLBACK] Body: ${textBody}`);
    console.log('==========================================');
    return { success: false, error: 'SMTP not configured' };
  }
  
  try {
    const fromName = process.env.SMTP_FROM_NAME || 'VidNote';
    const fromEmail = process.env.SMTP_USER;
    
    const info = await emailTransporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text: textBody,
      html: htmlBody,
    });
    
    console.log(`[EMAIL] Sent to ${to}, messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * @label Send Verification Email
 * @description Generate and send OTP code to user's email
 */
export async function sendVerificationEmail(email, name = 'User') {
  // Generate verification code
  const code = generateOTPCode();
  const hashedCode = hashCode(code);
  const expiresAt = new Date(Date.now() + CONFIG.CODE_EXPIRY_MINUTES * 60 * 1000);
  
  // Store verification data
  verificationStore.set(email, {
    hashedCode,
    expiresAt,
    attempts: 0,
    lastSentAt: Date.now(),
  });
  
  // Compose email
  const subject = 'Verify your VidNote account';
  
  // Plain text version
  const textBody = `
Hi ${name},

Your verification code is: ${code}

This code will expire in ${CONFIG.CODE_EXPIRY_MINUTES} minutes.

If you didn't request this code, please ignore this email.

Best,
The VidNote Team
  `.trim();
  
  // HTML version with nice styling
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <h1 style="color: #333; font-size: 24px; margin: 0 0 24px 0; text-align: center;">
      🎬 VidNote
    </h1>
    
    <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
      Hi ${name},
    </p>
    
    <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
      Use this verification code to verify your email:
    </p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 24px; text-align: center; margin: 0 0 24px 0;">
      <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px;">
        ${code}
      </span>
    </div>
    
    <p style="color: #888; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
      This code will expire in <strong>${CONFIG.CODE_EXPIRY_MINUTES} minutes</strong>.
    </p>
    
    <p style="color: #888; font-size: 14px; line-height: 1.5; margin: 0;">
      If you didn't request this code, you can safely ignore this email.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
    
    <p style="color: #aaa; font-size: 12px; text-align: center; margin: 0;">
      © ${new Date().getFullYear()} VidNote. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
  
  // Send email
  const result = await sendEmail(email, subject, htmlBody, textBody);
  
  // Log code for development only (remove in production!)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
  }
  
  return {
    success: true,
    email,
    expiresAt: expiresAt.toISOString(),
    // Include code in response for demo only - remove in production!
    demoCode: code,
  };
}

/**
 * @label Verify Email Code
 * @description Verify the OTP code entered by user
 */
export async function verifyEmailCode(email, code) {
  const storedData = verificationStore.get(email);
  
  // Check if verification was requested
  if (!storedData) {
    return {
      verified: false,
      message: 'No verification code found. Please request a new code.',
    };
  }
  
  // Check expiry
  if (new Date() > new Date(storedData.expiresAt)) {
    verificationStore.delete(email);
    return {
      verified: false,
      message: 'Verification code has expired. Please request a new code.',
    };
  }
  
  // Check max attempts
  if (storedData.attempts >= CONFIG.MAX_ATTEMPTS) {
    verificationStore.delete(email);
    return {
      verified: false,
      message: 'Too many failed attempts. Please request a new code.',
    };
  }
  
  // Verify code
  const hashedInput = hashCode(code);
  if (hashedInput !== storedData.hashedCode) {
    // Increment attempts
    storedData.attempts += 1;
    verificationStore.set(email, storedData);
    
    const remainingAttempts = CONFIG.MAX_ATTEMPTS - storedData.attempts;
    return {
      verified: false,
      message: `Invalid code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
    };
  }
  
  // Code is valid - mark email as verified
  verificationStore.delete(email);
  verifiedEmails.add(email);
  
  return {
    verified: true,
    email,
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * @label Resend Verification Code
 * @description Resend OTP code with rate limiting
 */
export async function resendVerificationCode(email, name = 'User') {
  const storedData = verificationStore.get(email);
  
  // Check cooldown
  if (storedData) {
    const timeSinceLastSent = Date.now() - storedData.lastSentAt;
    const cooldownMs = CONFIG.RESEND_COOLDOWN_SECONDS * 1000;
    
    if (timeSinceLastSent < cooldownMs) {
      const retryAfter = Math.ceil((cooldownMs - timeSinceLastSent) / 1000);
      return {
        success: false,
        message: `Please wait ${retryAfter} seconds before requesting a new code.`,
        retryAfter,
      };
    }
  }
  
  // Generate and send new code
  return sendVerificationEmail(email, name);
}

/**
 * @label Check If Email Is Verified
 * @description Check verification status of an email
 */
export function isEmailVerified(email) {
  return verifiedEmails.has(email);
}

/**
 * @label Get Verification Status
 * @description Get detailed verification status for an email
 */
export function getVerificationStatus(email) {
  const verified = verifiedEmails.has(email);
  const pendingVerification = verificationStore.has(email);
  
  return {
    email,
    verified,
    pendingVerification,
    expiresAt: pendingVerification ? verificationStore.get(email).expiresAt : null,
  };
}
