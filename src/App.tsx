import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Sparkle, 
  Copy, 
  Check, 
  Lightning, 
  Article, 
  ListBullets, 
  Question,
  YoutubeLogo,
  User as UserIcon,
  SignOut,
  ChartBar
} from '@phosphor-icons/react';
import { isValidYouTubeUrl, extractVideoId, getVideoTranscript, getVideoInfo } from '@/lib/youtube';
import { generateAllContent, type GeneratedContent } from '@/lib/ai';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import AuthPage from '@/components/AuthPage';
import DashboardPage from '@/components/DashboardPage';
import CheckoutPage from '@/components/CheckoutPage';
import { useKV } from '@github/spark/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function App() {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<{ title: string; thumbnail: string } | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; period: string } | null>(null);
  const [currentUser, setCurrentUser] = useKV<{ email: string; name: string } | null>('vidnote-current-user', null);

  const handleSignOut = () => {
    setCurrentUser(null);
    toast.success('Signed out successfully');
  };

  const handleAuthSuccess = (user: { email: string; name: string }) => {
    setShowAuthPage(false);
    setShowDashboard(true);
  };

  const handleSelectPlan = (plan: { name: string; price: string; period: string }) => {
    if (plan.name === 'Free') {
      toast.success('You are already on the free plan!');
      return;
    }
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  if (showCheckout && selectedPlan) {
    return (
      <CheckoutPage
        onBack={() => setShowCheckout(false)}
        selectedPlan={selectedPlan}
      />
    );
  }

  if (showAuthPage) {
    return <AuthPage onBack={() => setShowAuthPage(false)} onAuthSuccess={handleAuthSuccess} />;
  }

  if (showDashboard) {
    return <DashboardPage onBack={() => setShowDashboard(false)} user={currentUser || null} />;
  }

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setError('');
    setIsValidUrl(isValidYouTubeUrl(value));
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleGenerate = async () => {
    if (!isValidUrl) return;

    setIsLoading(true);
    setError('');
    setContent(null);
    setVideoInfo(null);

    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Could not extract video ID');
      }

      const [info, transcript] = await Promise.all([
        getVideoInfo(videoId),
        getVideoTranscript(videoId)
      ]);

      setVideoInfo(info);

      if (transcript.length < 50) {
        throw new Error('Transcript is too short or unavailable');
      }

      const generatedContent = await generateAllContent(transcript);
      setContent(generatedContent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster />
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-5xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="w-32"></div>
            <div className="flex items-center gap-2">
              <Sparkle size={32} weight="fill" className="text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">
                VidNote
              </h1>
            </div>
            <div className="w-32 flex justify-end gap-2">
              {currentUser ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowDashboard(true)}
                    className="gap-2"
                  >
                    <ChartBar weight="fill" />
                    Dashboard
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <UserIcon weight="fill" />
                        {currentUser.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowDashboard(true)}>
                        <ChartBar className="mr-2" size={16} />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserIcon className="mr-2" size={16} />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                        <SignOut className="mr-2" size={16} />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button onClick={() => setShowAuthPage(true)} className="gap-2">
                  <UserIcon weight="fill" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn any YouTube video into instant notes, key points, and Q&A
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lightning weight="fill" className="text-accent" />
              <span>Save time</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkle weight="fill" className="text-accent" />
              <span>AI-powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Check weight="bold" className="text-accent" />
              <span>Zero effort</span>
            </div>
          </div>
        </header>

        <div className="mb-12">
          <Card className="border-2 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                What is VidNote?
              </h2>
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed max-w-3xl mx-auto text-center mb-6">
                VidNote is your AI-powered learning companion that transforms lengthy YouTube videos into bite-sized, actionable knowledge in seconds. Simply paste any video link and get instant summaries, key takeaways, and study questions—perfect for students, professionals, and lifelong learners.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Lightning size={24} weight="fill" className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Save Time</h3>
                  <p className="text-sm text-muted-foreground">
                    Turn a 30-minute video into a 2-minute read. Get the essence without the wait.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                    <Sparkle size={24} weight="fill" className="text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Learn Smarter</h3>
                  <p className="text-sm text-muted-foreground">
                    AI extracts key concepts, generates study questions, and structures information for maximum retention.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Check size={24} weight="bold" className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Zero Effort</h3>
                  <p className="text-sm text-muted-foreground">
                    No signup required. Just paste, click, and get instant results. It's that simple.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <h3 className="font-semibold text-center mb-4 text-lg">Perfect For:</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-card rounded-full text-sm font-medium border border-border">
                    📚 Students studying for exams
                  </span>
                  <span className="px-4 py-2 bg-card rounded-full text-sm font-medium border border-border">
                    💼 Professionals learning new skills
                  </span>
                  <span className="px-4 py-2 bg-card rounded-full text-sm font-medium border border-border">
                    🎯 Interview preparation
                  </span>
                  <span className="px-4 py-2 bg-card rounded-full text-sm font-medium border border-border">
                    ✍️ Content creators repurposing videos
                  </span>
                  <span className="px-4 py-2 bg-card rounded-full text-sm font-medium border border-border">
                    🧠 Curious minds exploring topics
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <YoutubeLogo size={20} weight="fill" className="text-muted-foreground" />
                  </div>
                  <Input
                    id="youtube-url"
                    type="text"
                    placeholder="Paste YouTube video URL here..."
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && isValidUrl && !isLoading && handleGenerate()}
                    className={`pl-10 h-12 text-base ${
                      url && !isValidUrl ? 'border-destructive focus-visible:ring-destructive' : ''
                    } ${url && isValidUrl ? 'border-accent' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={!isValidUrl || isLoading}
                  size="lg"
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-medium"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate
                      <ArrowRight weight="bold" />
                    </>
                  )}
                </Button>
              </div>
              {url && !isValidUrl && (
                <p className="text-sm text-destructive mt-2">
                  Please enter a valid YouTube URL (e.g., youtube.com/watch?v=... or youtu.be/...)
                </p>
              )}
              {error && (
                <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                  <span className="font-medium">Error:</span> {error}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {(isLoading || content) && (
          <div className="space-y-8">
            {videoInfo && (
              <Card className="border-2 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-32 md:h-auto bg-muted flex-shrink-0">
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${extractVideoId(url)}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg leading-snug">{videoInfo.title}</CardTitle>
                  </CardHeader>
                </div>
              </Card>
            )}

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Article size={24} weight="fill" className="text-primary" />
                    <CardTitle>Summary</CardTitle>
                  </div>
                  {content?.summary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(content.summary, 'summary')}
                      className="gap-2"
                    >
                      {copiedSection === 'summary' ? (
                        <Check weight="bold" className="text-accent" />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  )}
                </div>
                <CardDescription>AI-generated overview of the video content</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {isLoading && !content ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : content?.summary ? (
                  <div className="prose prose-sm max-w-none leading-relaxed text-foreground">
                    {content.summary.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListBullets size={24} weight="fill" className="text-primary" />
                    <CardTitle>Key Points</CardTitle>
                  </div>
                  {content?.keyPoints && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(content.keyPoints.join('\n'), 'keypoints')}
                      className="gap-2"
                    >
                      {copiedSection === 'keypoints' ? (
                        <Check weight="bold" className="text-accent" />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  )}
                </div>
                <CardDescription>Essential takeaways and main concepts</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {isLoading && !content ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                ) : content?.keyPoints ? (
                  <ul className="space-y-3">
                    {content.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="flex-1 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Question size={24} weight="fill" className="text-primary" />
                    <CardTitle>Questions & Answers</CardTitle>
                  </div>
                  {content?.qaPairs && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          content.qaPairs
                            .map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}`)
                            .join('\n\n'),
                          'qa'
                        )
                      }
                      className="gap-2"
                    >
                      {copiedSection === 'qa' ? (
                        <Check weight="bold" className="text-accent" />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  )}
                </div>
                <CardDescription>Test your understanding with these questions</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {isLoading && !content ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ))}
                  </div>
                ) : content?.qaPairs ? (
                  <Accordion type="single" collapsible className="w-full">
                    {content.qaPairs.map((qa, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">
                            <span className="text-accent mr-2">Q{idx + 1}:</span>
                            {qa.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                          {qa.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && !content && !error && (
          <div className="text-center py-16 text-muted-foreground">
            <Sparkle size={48} weight="thin" className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Paste a YouTube URL above to get started</p>
            <p className="text-sm mt-2">Works with any video that has captions enabled</p>
          </div>
        )}
      </div>

      <PricingSection onSelectPlan={handleSelectPlan} />

      <FAQSection />

      <Footer />
    </div>
  );
}
