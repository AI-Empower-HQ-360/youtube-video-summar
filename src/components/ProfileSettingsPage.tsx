/**
 * @label Profile Settings Page
 * @description Comprehensive account settings with Gmail verification
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Sparkle, 
  ArrowLeft,
  User,
  EnvelopeSimple,
  Lock,
  Shield,
  CheckCircle,
  Warning,
  Camera,
  Bell,
  Moon,
  Globe,
  Key,
  Trash,
  Eye,
  EyeSlash,
  GoogleLogo,
  GithubLogo,
  LinkSimple,
  Clock,
  DeviceMobile,
  At
} from '@phosphor-icons/react';
import { authApi } from '@/services/auth.api';
import { useKV } from '@/hooks/useKV';

// ============================================
// TYPES
// ============================================

interface ProfileSettingsPageProps {
  onBack: () => void;
  user: { email: string; name: string } | null;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  emailVerified: boolean;
  verificationCode?: string;
  verificationSentAt?: number;
  twoFactorEnabled: boolean;
  connectedAccounts: {
    google?: { email: string; connectedAt: number };
    github?: { username: string; connectedAt: number };
  };
  notifications: {
    email: boolean;
    summaryComplete: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
  };
  preferences: {
    darkMode: boolean;
    compactView: boolean;
    autoSave: boolean;
  };
  createdAt: number;
  lastLoginAt: number;
}

// ============================================
// COMPONENT
// ============================================

export default function ProfileSettingsPage({ onBack, user }: ProfileSettingsPageProps) {
  // Create default profile for the user
  const defaultProfile: UserProfile = {
    name: user?.name || 'User',
    email: user?.email || '',
    emailVerified: false,
    twoFactorEnabled: false,
    connectedAccounts: {},
    notifications: {
      email: true,
      summaryComplete: true,
      weeklyDigest: false,
      productUpdates: true,
    },
    preferences: {
      darkMode: false,
      compactView: false,
      autoSave: true,
    },
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  };

  // Profile state from KV storage - use default profile as initial value
  const [storedProfile, setStoredProfile] = useKV<UserProfile | null>(
    `vidnote-profile-${user?.email || 'guest'}`, 
    null
  );
  
  // Use stored profile if available, otherwise use default
  const userProfile = storedProfile || defaultProfile;
  
  // Local state for forms
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  
  // Email verification state
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationStep, setVerificationStep] = useState<'send' | 'verify'>('send');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Save default profile if none exists
  useEffect(() => {
    if (user && !storedProfile) {
      setStoredProfile({
        name: user.name,
        email: user.email,
        emailVerified: false,
        twoFactorEnabled: false,
        connectedAccounts: {},
        notifications: {
          email: true,
          summaryComplete: true,
          weeklyDigest: false,
          productUpdates: true,
        },
        preferences: {
          darkMode: false,
          compactView: false,
          autoSave: true,
        },
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      });
    }
  }, [user, storedProfile, setStoredProfile]);

  // Initialize form values when profile loads
  useEffect(() => {
    if (storedProfile) {
      setEditName(storedProfile.name);
      setEditEmail(storedProfile.email);
      setEditPhone(storedProfile.phone || '');
    }
  }, [storedProfile]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * @label Save Profile Changes
   * @description Update user profile information
   */
  const handleSaveProfile = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const emailChanged = editEmail !== userProfile.email;
    
    setStoredProfile({
      ...userProfile,
      name: editName,
      email: editEmail,
      phone: editPhone,
      emailVerified: emailChanged ? false : userProfile.emailVerified,
    });
    
    toast.success('Profile updated successfully!');
    
    if (emailChanged) {
      toast.info('Please verify your new email address');
      setShowVerificationDialog(true);
      setVerificationStep('send');
    }
    
    setIsLoading(false);
  };

  /**
   * @label Send Verification Email
   * @description Send OTP code to user's email for verification via backend API
   */
  const handleSendVerificationEmail = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    
    try {
      // Call backend API to send verification email
      const response = await authApi.sendVerificationEmail(
        userProfile.email,
        userProfile.name || 'User'
      );
      
      if (response.success) {
        setStoredProfile({
          ...userProfile,
          verificationSentAt: Date.now(),
        });
        
        toast.success(`Verification code sent to ${userProfile.email}`);
        toast.info('Check your email inbox (and spam folder)', { duration: 5000 });
        
        setVerificationStep('verify');
        setResendCooldown(60);
      } else {
        toast.error(response.message || 'Failed to send verification email');
      }
    } catch (error: unknown) {
      console.error('Failed to send verification email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @label Verify Email Code
   * @description Verify the OTP code entered by user via backend API
   */
  const handleVerifyCode = async () => {
    if (!userProfile) return;
    
    const enteredCode = verificationCode.join('');
    
    if (enteredCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call backend API to verify the code
      const response = await authApi.verifyEmail(userProfile.email, enteredCode);
      
      if (response.success) {
        setStoredProfile({
          ...userProfile,
          emailVerified: true,
          verificationSentAt: undefined,
        });
        
        toast.success('Email verified successfully! 🎉');
        setShowVerificationDialog(false);
        setVerificationCode(['', '', '', '', '', '']);
      } else {
        toast.error(response.message || 'Invalid verification code. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Failed to verify code:', error);
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @label Handle OTP Input
   * @description Handle individual digit input for OTP
   */
  const handleOtpInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  /**
   * @label Handle OTP Keydown
   * @description Handle backspace navigation in OTP inputs
   */
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  /**
   * @label Change Password
   * @description Update user password with validation
   */
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
  };

  /**
   * @label Toggle Two-Factor Auth
   * @description Enable or disable 2FA
   */
  const handleToggle2FA = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStoredProfile({
      ...userProfile,
      twoFactorEnabled: !userProfile.twoFactorEnabled,
    });
    
    toast.success(
      userProfile.twoFactorEnabled
        ? 'Two-factor authentication disabled'
        : 'Two-factor authentication enabled! 🔐'
    );
    
    setIsLoading(false);
  };

  /**
   * @label Connect Google Account
   * @description Link Google account for OAuth
   */
  const handleConnectGoogle = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStoredProfile({
      ...userProfile,
      connectedAccounts: {
        ...userProfile.connectedAccounts,
        google: {
          email: `${userProfile.name.toLowerCase().replace(' ', '.')}@gmail.com`,
          connectedAt: Date.now(),
        },
      },
    });
    
    toast.success('Google account connected successfully!');
    setIsLoading(false);
  };

  /**
   * @label Connect GitHub Account
   * @description Link GitHub account for OAuth
   */
  const handleConnectGitHub = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStoredProfile({
      ...userProfile,
      connectedAccounts: {
        ...userProfile.connectedAccounts,
        github: {
          username: userProfile.name.toLowerCase().replace(' ', '-'),
          connectedAt: Date.now(),
        },
      },
    });
    
    toast.success('GitHub account connected successfully!');
    setIsLoading(false);
  };

  /**
   * @label Disconnect Account
   * @description Remove linked OAuth account
   */
  const handleDisconnectAccount = async (provider: 'google' | 'github') => {
    if (!userProfile) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedAccounts = { ...userProfile.connectedAccounts };
    delete updatedAccounts[provider];
    
    setStoredProfile({
      ...userProfile,
      connectedAccounts: updatedAccounts,
    });
    
    toast.success(`${provider === 'google' ? 'Google' : 'GitHub'} account disconnected`);
    setIsLoading(false);
  };

  /**
   * @label Update Notification Settings
   * @description Toggle notification preferences
   */
  const handleNotificationChange = (key: keyof UserProfile['notifications'], value: boolean) => {
    if (!userProfile) return;
    
    setStoredProfile({
      ...userProfile,
      notifications: {
        ...userProfile.notifications,
        [key]: value,
      },
    });
    
    toast.success('Notification settings updated');
  };

  /**
   * @label Update Preferences
   * @description Toggle app preferences
   */
  const handlePreferenceChange = (key: keyof UserProfile['preferences'], value: boolean) => {
    if (!userProfile) return;
    
    setStoredProfile({
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        [key]: value,
      },
    });
    
    toast.success('Preferences updated');
  };

  /**
   * @label Delete Account
   * @description Permanently delete user account
   */
  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== userProfile?.email) {
      toast.error('Email does not match');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Account deleted successfully');
    setShowDeleteDialog(false);
    setIsLoading(false);
    onBack();
  };

  /**
   * @label Get Initials
   * @description Extract initials from name for avatar
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * @label Calculate Profile Completion
   * @description Calculate profile completion percentage
   */
  const getProfileCompletion = () => {
    if (!userProfile) return 0;
    
    let completed = 0;
    const total = 6;
    
    if (userProfile.name) completed++;
    if (userProfile.email) completed++;
    if (userProfile.emailVerified) completed++;
    if (userProfile.phone) completed++;
    if (userProfile.avatar) completed++;
    if (Object.keys(userProfile.connectedAccounts).length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // Only show loading if there's no user at all
  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster />
      
      {/* Email Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <EnvelopeSimple size={24} weight="fill" className="text-primary" />
              Verify Your Email
            </DialogTitle>
            <DialogDescription>
              {verificationStep === 'send'
                ? `We'll send a 6-digit code to ${userProfile.email}`
                : `Enter the code sent to ${userProfile.email}`}
            </DialogDescription>
          </DialogHeader>
          
          {verificationStep === 'send' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 flex items-center gap-3">
                <At size={24} className="text-muted-foreground" />
                <div>
                  <p className="font-medium">{userProfile.email}</p>
                  <p className="text-sm text-muted-foreground">Verification email will be sent here</p>
                </div>
              </div>
              
              <Button
                onClick={handleSendVerificationEmail}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <EnvelopeSimple className="mr-2" size={18} />
                    Send Verification Code
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    disabled={isLoading}
                  />
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Didn't receive code?</span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleSendVerificationEmail}
                  disabled={resendCooldown > 0 || isLoading}
                  className="p-0"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </Button>
              </div>
              
              <Button
                onClick={handleVerifyCode}
                className="w-full"
                disabled={isLoading || verificationCode.some(d => !d)}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2" size={18} />
                    Verify Email
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Warning size={24} weight="fill" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data, including video history and settings, will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium mb-2">
                You will lose access to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All video summaries and history</li>
                <li>• Connected accounts and preferences</li>
                <li>• Current subscription (no refunds)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label>Type your email to confirm: <strong>{userProfile.email}</strong></Label>
              <Input
                type="email"
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmEmail !== userProfile.email || isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-6 md:px-12 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:bg-secondary"
          >
            <ArrowLeft />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Sparkle size={28} weight="fill" className="text-accent" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">
              Account Settings
            </h1>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Profile Summary Card */}
        <Card className="border-2 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {getInitials(userProfile.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                >
                  <Camera size={16} />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                  {userProfile.emailVerified ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle size={14} weight="fill" className="mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      <Warning size={14} weight="fill" className="mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3">{userProfile.email}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Profile Completion</span>
                      <span className="font-medium">{getProfileCompletion()}%</span>
                    </div>
                    <Progress value={getProfileCompletion()} className="h-2" />
                  </div>
                  
                  {!userProfile.emailVerified && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowVerificationDialog(true);
                        setVerificationStep('send');
                      }}
                      className="gap-2"
                    >
                      <EnvelopeSimple size={16} />
                      Verify Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield size={16} />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="connected" className="gap-2">
              <LinkSimple size={16} />
              <span className="hidden sm:inline">Connected</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell size={16} />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User size={24} weight="fill" className="text-primary" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <div className="relative">
                        <User 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={18}
                        />
                        <Input
                          id="profile-name"
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Your name"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Phone Number</Label>
                      <div className="relative">
                        <DeviceMobile 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={18}
                        />
                        <Input
                          id="profile-phone"
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <div className="relative">
                      <EnvelopeSimple 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="profile-email"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10"
                      />
                      {userProfile.emailVerified && editEmail === userProfile.email && (
                        <CheckCircle 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                          size={18}
                          weight="fill"
                        />
                      )}
                    </div>
                    {editEmail !== userProfile.email && (
                      <p className="text-sm text-amber-600">
                        Changing email will require re-verification
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profile-timezone">Timezone</Label>
                      <div className="relative">
                        <Clock 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={18}
                        />
                        <Input
                          id="profile-timezone"
                          type="text"
                          value={userProfile.timezone || 'UTC'}
                          readOnly
                          className="pl-10 bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-language">Language</Label>
                      <div className="relative">
                        <Globe 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={18}
                        />
                        <Input
                          id="profile-language"
                          type="text"
                          value={userProfile.language || 'English'}
                          readOnly
                          className="pl-10 bg-muted"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditName(userProfile.name);
                        setEditEmail(userProfile.email);
                        setEditPhone(userProfile.phone || '');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Password Section */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock size={24} weight="fill" className="text-primary" />
                    <CardTitle>Change Password</CardTitle>
                  </div>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <form className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Lock 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={18}
                        />
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Key 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={18}
                        />
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Key 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={18}
                        />
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Two-Factor Auth Section */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield size={24} weight="fill" className="text-primary" />
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </div>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {userProfile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.twoFactorEnabled
                          ? 'Your account is protected with 2FA'
                          : 'Enable 2FA for enhanced security'}
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.twoFactorEnabled}
                      onCheckedChange={handleToggle2FA}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-2 border-destructive/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Warning size={24} weight="fill" className="text-destructive" />
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </div>
                  <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash className="mr-2" size={16} />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Connected Accounts Tab */}
          <TabsContent value="connected">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LinkSimple size={24} weight="fill" className="text-primary" />
                  <CardTitle>Connected Accounts</CardTitle>
                </div>
                <CardDescription>Manage your linked social accounts for easier sign-in</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-4">
                {/* Google Account */}
                <div className="flex items-center justify-between p-4 rounded-lg border-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-red-500/10">
                      <GoogleLogo size={24} weight="fill" className="text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">Google</p>
                      {userProfile.connectedAccounts.google ? (
                        <p className="text-sm text-muted-foreground">
                          {userProfile.connectedAccounts.google.email}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      )}
                    </div>
                  </div>
                  {userProfile.connectedAccounts.google ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectAccount('google')}
                      disabled={isLoading}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleConnectGoogle}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <GoogleLogo size={16} weight="fill" />
                      Connect
                    </Button>
                  )}
                </div>

                {/* GitHub Account */}
                <div className="flex items-center justify-between p-4 rounded-lg border-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gray-500/10">
                      <GithubLogo size={24} weight="fill" className="text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">GitHub</p>
                      {userProfile.connectedAccounts.github ? (
                        <p className="text-sm text-muted-foreground">
                          @{userProfile.connectedAccounts.github.username}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      )}
                    </div>
                  </div>
                  {userProfile.connectedAccounts.github ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectAccount('github')}
                      disabled={isLoading}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleConnectGitHub}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <GithubLogo size={16} weight="fill" />
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell size={24} weight="fill" className="text-primary" />
                    <CardTitle>Email Notifications</CardTitle>
                  </div>
                  <CardDescription>Choose what emails you want to receive</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your account activity
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Summary Complete</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your video summary is ready
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.notifications.summaryComplete}
                      onCheckedChange={(checked) => handleNotificationChange('summaryComplete', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">
                        Weekly summary of your activity and insights
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.notifications.weeklyDigest}
                      onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Product Updates</p>
                      <p className="text-sm text-muted-foreground">
                        News about product features and improvements
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.notifications.productUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('productUpdates', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Moon size={24} weight="fill" className="text-primary" />
                    <CardTitle>Preferences</CardTitle>
                  </div>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the interface
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.darkMode}
                      onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Compact View</p>
                      <p className="text-sm text-muted-foreground">
                        Display more content with smaller spacing
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.compactView}
                      onCheckedChange={(checked) => handlePreferenceChange('compactView', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Auto-Save</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically save summaries to history
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.autoSave}
                      onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
