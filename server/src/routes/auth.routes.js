/**
 * @label Auth Routes
 * @description Routes for authentication and email verification
 */

import express from 'express';
import { sendVerificationEmail, verifyEmailCode, resendVerificationCode } from '../services/auth.service.js';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

// ============================================
// EMAIL VERIFICATION ROUTES
// ============================================

/**
 * @label Send Verification Email
 * @description Send OTP code to user's email for verification
 * @route POST /api/auth/send-verification
 */
router.post('/send-verification', async (req, res, next) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    
    const result = await sendVerificationEmail(email, name);
    
    res.json({
      success: true,
      message: 'Verification code sent successfully',
      data: {
        email: result.email,
        expiresAt: result.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @label Verify Email Code
 * @description Verify the OTP code entered by user
 * @route POST /api/auth/verify-email
 */
router.post('/verify-email', async (req, res, next) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and code are required',
      });
    }
    
    const result = await verifyEmailCode(email, code);
    
    if (!result.verified) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Invalid verification code',
      });
    }
    
    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: result.email,
        verifiedAt: result.verifiedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @label Resend Verification Code
 * @description Resend OTP code to user's email
 * @route POST /api/auth/resend-verification
 */
router.post('/resend-verification', async (req, res, next) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    
    const result = await resendVerificationCode(email, name);
    
    if (!result.success) {
      return res.status(429).json({
        success: false,
        message: result.message || 'Please wait before requesting a new code',
        retryAfter: result.retryAfter,
      });
    }
    
    res.json({
      success: true,
      message: 'Verification code resent successfully',
      data: {
        email: result.email,
        expiresAt: result.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @label Check Email Verification Status
 * @description Check if an email is verified
 * @route GET /api/auth/verification-status/:email
 */
router.get('/verification-status/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    
    // In production, query database for verification status
    // For demo, always return unverified
    res.json({
      success: true,
      data: {
        email,
        verified: false,
        verifiedAt: null,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
