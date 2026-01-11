import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { 
  Sparkle, 
  ArrowLeft,
  User,
  EnvelopeSimple,
  ChartBar,
  Clock,
  Video,
  Trash,
  Eye,
  Crown,
  Lightning,
  Calendar,
  Notebook,
  CheckCircle,
  TrendUp
} from '@phosphor-icons/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { format } from 'date-fns';

interface DashboardPageProps {
  onBack: () => void;
  user: { email: string; name: string } | null;
}

interface VideoHistory {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  generatedAt: number;
  summary: string;
}

export default function DashboardPage({ onBack, user }: DashboardPageProps) {
  const [videoHistory] = useLocalStorage<VideoHistory[]>('vidnote-history', []);
  const [userPlan] = useLocalStorage<'free' | 'basic' | 'pro'>('vidnote-user-plan', 'free');
  const [videosProcessedToday] = useLocalStorage<number>('vidnote-videos-today', 0);
  const [totalVideosProcessed] = useLocalStorage<number>('vidnote-total-videos', 0);
  const [, setDeleteVideoId] = useState<string | null>(null);

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const planLimits = {
    free: { videos: 1, duration: 30, name: 'Free' },
    basic: { videos: 50, duration: 120, name: 'Basic' },
    pro: { videos: 999999, duration: 300, name: 'Pro' },
  };

  const currentPlan = planLimits[userPlan || 'free'];
  const processedToday = videosProcessedToday || 0;
  const totalProcessed = totalVideosProcessed || 0;
  const usagePercentage = (processedToday / currentPlan.videos) * 100;

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleDeleteVideo = (videoId: string) => {
    setDeleteVideoId(videoId);
    toast.success('Video deleted from history');
  };

  const stats = [
    {
      label: 'Videos Today',
      value: processedToday.toString(),
      max: currentPlan.videos === 999999 ? '∞' : currentPlan.videos.toString(),
      icon: Video,
      color: 'text-primary',
    },
    {
      label: 'Total Processed',
      value: totalProcessed.toString(),
      icon: ChartBar,
      color: 'text-accent',
    },
    {
      label: 'Time Saved',
      value: `${Math.round(totalProcessed * 28)}m`,
      icon: Clock,
      color: 'text-primary',
    },
    {
      label: 'Current Plan',
      value: currentPlan.name,
      icon: Crown,
      color: 'text-accent',
    },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster />
      <div className="container mx-auto px-6 md:px-12 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:bg-secondary"
          >
            <ArrowLeft />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <Sparkle size={28} weight="fill" className="text-accent" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">
              Dashboard
            </h1>
          </div>
          <div className="w-32"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">
                      {stat.value}
                      {stat.max && (
                        <span className="text-lg text-muted-foreground ml-1">/ {stat.max}</span>
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                    <stat.icon size={24} weight="fill" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {userPlan !== 'pro' && (
          <Card className="border-2 border-accent/50 bg-accent/5 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <Lightning size={24} weight="fill" className="text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {userPlan === 'free' ? 'Unlock More Videos' : 'Upgrade to Pro'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {userPlan === 'free'
                      ? 'Get 50 videos per month with Basic plan, or unlimited with Pro'
                      : 'Process unlimited videos and get advanced features with Pro plan'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                      <Crown weight="fill" />
                      Upgrade Now
                    </Button>
                    <Button variant="outline">View All Plans</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp size={24} weight="fill" className="text-primary" />
              Daily Usage
            </CardTitle>
            <CardDescription>Track your video processing for today</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Videos Processed</span>
                <span className="font-semibold">
                  {processedToday} / {currentPlan.videos === 999999 ? '∞' : currentPlan.videos}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-3" />
              {usagePercentage >= 80 && usagePercentage < 100 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  You're almost at your daily limit. Consider upgrading for more videos.
                </p>
              )}
              {usagePercentage >= 100 && (
                <p className="text-sm text-destructive">
                  You've reached your daily limit. Upgrade to continue processing videos.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Notebook size={24} weight="fill" className="text-primary" />
                    <CardTitle>Video History</CardTitle>
                  </div>
                  {videoHistory && videoHistory.length > 0 && (
                    <Badge variant="secondary">{videoHistory.length} videos</Badge>
                  )}
                </div>
                <CardDescription>
                  All your processed videos in one place
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {!videoHistory || videoHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Video size={48} weight="thin" className="mx-auto mb-4 opacity-50 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">No videos processed yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start by pasting a YouTube URL on the home page
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videoHistory.map((video) => (
                      <div
                        key={video.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border-2 border-border hover:border-accent/50 transition-colors"
                      >
                        <div className="w-full sm:w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1 line-clamp-1">{video.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {video.summary}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar size={14} />
                            <span>{format(new Date(video.generatedAt), 'MMM dd, yyyy')}</span>
                            <span>•</span>
                            <Clock size={14} />
                            <span>{format(new Date(video.generatedAt), 'h:mm a')}</span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none gap-2"
                          >
                            <Eye size={16} />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash size={16} />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User size={24} weight="fill" className="text-primary" />
                  <CardTitle>Profile Settings</CardTitle>
                </div>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                    />
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Status</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                      <CheckCircle size={20} weight="fill" className="text-primary" />
                      <span className="text-sm">Active • Verified</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      onClick={handleSaveProfile}
                      className="w-full sm:w-auto"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>

                <Separator className="my-8" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Danger Zone</h3>
                  <div className="border-2 border-destructive/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown size={24} weight="fill" className="text-accent" />
                  <CardTitle>Billing & Subscription</CardTitle>
                </div>
                <CardDescription>Manage your plan and payment methods</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base">Current Plan</Label>
                    <div className="mt-3 p-6 border-2 border-accent/50 bg-accent/5 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-accent/10">
                            <Crown size={24} weight="fill" className="text-accent" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl capitalize">{userPlan} Plan</h3>
                            <p className="text-sm text-muted-foreground">
                              {userPlan === 'free' && 'Perfect for casual learners'}
                              {userPlan === 'basic' && 'For regular knowledge seekers'}
                              {userPlan === 'pro' && 'For power users & professionals'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">
                            {userPlan === 'free' && '$0'}
                            {userPlan === 'basic' && '$22'}
                            {userPlan === 'pro' && '$45'}
                          </p>
                          <p className="text-sm text-muted-foreground">/month</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Daily Videos:</span>
                          <span className="font-semibold ml-2">
                            {currentPlan.videos === 999999 ? 'Unlimited' : `${currentPlan.videos} videos`}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max Duration:</span>
                          <span className="font-semibold ml-2">{currentPlan.duration} min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {userPlan !== 'pro' && (
                    <div className="space-y-3">
                      <Label className="text-base">Upgrade Your Plan</Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {userPlan === 'free' && (
                          <>
                            <Button className="h-auto py-4 flex flex-col items-start gap-2" variant="outline">
                              <span className="font-bold text-lg">Basic - $22/mo</span>
                              <span className="text-xs text-muted-foreground">50 videos per month</span>
                            </Button>
                            <Button className="h-auto py-4 flex flex-col items-start gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                              <span className="font-bold text-lg">Pro - $45/mo</span>
                              <span className="text-xs">Unlimited videos</span>
                            </Button>
                          </>
                        )}
                        {userPlan === 'basic' && (
                          <Button className="h-auto py-4 flex flex-col items-start gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                            <span className="font-bold text-lg">Pro - $45/mo</span>
                            <span className="text-xs">Unlimited videos & more</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Label className="text-base">Payment Method</Label>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">
                      {userPlan === 'free'
                        ? 'No payment method required for free plan'
                        : 'Manage your payment methods'}
                    </p>
                    {userPlan !== 'free' && (
                      <Button variant="outline">Add Payment Method</Button>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base">Billing History</Label>
                    <p className="text-sm text-muted-foreground mt-2">
                      {userPlan === 'free'
                        ? 'No billing history available'
                        : 'View your past invoices and receipts'}
                    </p>
                    {userPlan !== 'free' && (
                      <Button variant="outline" className="mt-4">View Invoices</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
