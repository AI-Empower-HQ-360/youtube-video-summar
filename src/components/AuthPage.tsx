import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { 
  Sparkle, 
  EnvelopeSimple, 
  Lock, 
  User,
  GithubLogo,
  GoogleLogo,
  ArrowLeft
} from '@phosphor-icons/react';
import { useKV } from '@github/spark/hooks';

interface AuthPageProps {
  onBack: () => void;
  onAuthSuccess: (user: { email: string; name: string }) => void;
}

export default function AuthPage({ onBack, onAuthSuccess }: AuthPageProps) {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useKV<Record<string, { name: string; password: string }>>('vidnote-users', {});
  const [, setCurrentUser] = useKV<{ email: string; name: string } | null>('vidnote-current-user', null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (!signInEmail || !signInPassword) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const user = users?.[signInEmail];
    if (!user || user.password !== signInPassword) {
      toast.error('Invalid email or password');
      setIsLoading(false);
      return;
    }

    const authUser = { email: signInEmail, name: user.name };
    setCurrentUser(authUser);
    toast.success(`Welcome back, ${user.name}!`);
    setIsLoading(false);
    onAuthSuccess(authUser);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (users?.[signUpEmail]) {
      toast.error('Email already registered');
      setIsLoading(false);
      return;
    }

    setUsers((currentUsers) => ({
      ...(currentUsers || {}),
      [signUpEmail]: { name: signUpName, password: signUpPassword }
    }));

    const authUser = { email: signUpEmail, name: signUpName };
    setCurrentUser(authUser);
    toast.success('Account created successfully! Welcome aboard! 🎉');
    setIsLoading(false);
    onAuthSuccess(authUser);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockGoogleUser = {
      email: `user${Date.now()}@gmail.com`,
      name: `Gmail User ${Math.floor(Math.random() * 1000)}`
    };
    
    setUsers((currentUsers) => ({
      ...(currentUsers || {}),
      [mockGoogleUser.email]: { name: mockGoogleUser.name, password: 'google-oauth' }
    }));
    
    setCurrentUser(mockGoogleUser);
    toast.success(`Welcome, ${mockGoogleUser.name}! 🎉`);
    setIsLoading(false);
    onAuthSuccess(mockGoogleUser);
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockGitHubUser = {
      email: `dev${Date.now()}@github.com`,
      name: `GitHub User ${Math.floor(Math.random() * 1000)}`
    };
    
    setUsers((currentUsers) => ({
      ...(currentUsers || {}),
      [mockGitHubUser.email]: { name: mockGitHubUser.name, password: 'github-oauth' }
    }));
    
    setCurrentUser(mockGitHubUser);
    toast.success(`Welcome, ${mockGitHubUser.name}! 🎉`);
    setIsLoading(false);
    onAuthSuccess(mockGitHubUser);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <Toaster />
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 hover:bg-secondary"
        >
          <ArrowLeft />
          Back to Home
        </Button>

        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkle size={32} weight="fill" className="text-accent" />
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            VidNote
          </h1>
        </div>

        <Card className="border-2 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <EnvelopeSimple 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-accent hover:underline"
                      onClick={() => toast.info('Password reset coming soon!')}
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <EnvelopeSimple 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleGitHubSignIn}
                className="gap-2"
                disabled={isLoading}
              >
                <GithubLogo size={18} weight="fill" />
                GitHub
              </Button>
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                className="gap-2"
                disabled={isLoading}
              >
                <GoogleLogo size={18} weight="fill" />
                Google
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-6">
              By continuing, you agree to our{' '}
              <button className="text-accent hover:underline">Terms of Service</button>
              {' '}and{' '}
              <button className="text-accent hover:underline">Privacy Policy</button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          VidNote • AI-Powered Learning for Everyone
        </p>
      </div>
    </div>
  );
}
