import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Code, Terminal, Key, Lock } from '@phosphor-icons/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface APIReferencePageProps {
  onBack: () => void;
}

export default function APIReferencePage({ onBack }: APIReferencePageProps) {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-5xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft weight="bold" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <Terminal size={32} weight="fill" className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">API Reference</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Integrate VidNote into your applications
          </p>
        </div>

        <div className="mb-8">
          <Card className="border-2 border-accent/50 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Lock size={24} weight="fill" className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">API Access Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We're currently building our developer API. Sign up for a Pro account to be notified when API access becomes available. Early adopters will receive special pricing and priority access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key weight="fill" className="text-accent" />
                Authentication
              </CardTitle>
              <CardDescription>How to authenticate API requests</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">
                All API requests require authentication using an API key. You can generate API keys from your dashboard once API access is available.
              </p>
              
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">// Example Authentication Header</div>
                <div>Authorization: Bearer YOUR_API_KEY</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Security Best Practices:</h4>
                <ul className="space-y-1 text-muted-foreground ml-6">
                  <li>• Never share your API key publicly</li>
                  <li>• Use environment variables to store keys</li>
                  <li>• Rotate keys regularly</li>
                  <li>• Use separate keys for development and production</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code weight="fill" className="text-accent" />
                Endpoints (Preview)
              </CardTitle>
              <CardDescription>Planned API endpoints</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Tabs defaultValue="generate" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="generate">Generate</TabsTrigger>
                  <TabsTrigger value="status">Status</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="generate" className="space-y-4 mt-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-bold">POST</span>
                      <code className="text-sm">/api/v1/generate</code>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Generate summary, key points, and Q&A for a YouTube video.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Request Body:</h4>
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "url": "https://youtube.com/watch?v=VIDEO_ID",
  "options": {
    "includeSummary": true,
    "includeKeyPoints": true,
    "includeQA": true,
    "qaCount": 5
  }
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Response (200 OK):</h4>
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "id": "gen_abc123",
  "videoId": "VIDEO_ID",
  "title": "Video Title",
  "thumbnail": "https://...",
  "summary": "AI-generated summary...",
  "keyPoints": [
    "First key point...",
    "Second key point..."
  ],
  "qaPairs": [
    {
      "question": "What is...?",
      "answer": "The answer is..."
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z"
}`}</pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="status" className="space-y-4 mt-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-bold">GET</span>
                      <code className="text-sm">/api/v1/generate/:id</code>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Check the status of a generation request.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Response (200 OK):</h4>
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "id": "gen_abc123",
  "status": "completed",
  "progress": 100,
  "result": {
    // Same structure as generate endpoint
  }
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Status Values:</h4>
                    <ul className="space-y-2 text-muted-foreground ml-6">
                      <li>• <code className="bg-muted px-2 py-1 rounded text-xs">pending</code> - Request queued</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded text-xs">processing</code> - AI is generating content</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded text-xs">completed</code> - Generation finished</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded text-xs">failed</code> - Error occurred</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4 mt-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-bold">GET</span>
                      <code className="text-sm">/api/v1/history</code>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Retrieve your generation history.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Query Parameters:</h4>
                    <ul className="space-y-2 text-muted-foreground ml-6">
                      <li>• <code className="bg-muted px-2 py-1 rounded text-xs">limit</code> - Number of results (default: 20, max: 100)</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded text-xs">offset</code> - Pagination offset</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded text-xs">sort</code> - Sort order (newest, oldest)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Response (200 OK):</h4>
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "items": [
    {
      "id": "gen_abc123",
      "videoId": "VIDEO_ID",
      "title": "Video Title",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}`}</pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>API usage limits by plan</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-semibold">Free Plan</h4>
                    <p className="text-sm text-muted-foreground">For personal projects</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">10 requests/day</p>
                    <p className="text-sm text-muted-foreground">1 request/minute</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-semibold">Basic Plan</h4>
                    <p className="text-sm text-muted-foreground">For regular use</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">100 requests/day</p>
                    <p className="text-sm text-muted-foreground">10 requests/minute</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-semibold">Pro Plan</h4>
                    <p className="text-sm text-muted-foreground">For power users</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">1000 requests/day</p>
                    <p className="text-sm text-muted-foreground">60 requests/minute</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Error Codes</CardTitle>
              <CardDescription>Common error responses</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <code className="text-destructive font-mono text-sm">400</code>
                  <div>
                    <p className="font-semibold">Bad Request</p>
                    <p className="text-sm text-muted-foreground">Invalid request parameters</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <code className="text-destructive font-mono text-sm">401</code>
                  <div>
                    <p className="font-semibold">Unauthorized</p>
                    <p className="text-sm text-muted-foreground">Invalid or missing API key</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <code className="text-destructive font-mono text-sm">429</code>
                  <div>
                    <p className="font-semibold">Rate Limit Exceeded</p>
                    <p className="text-sm text-muted-foreground">Too many requests, try again later</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <code className="text-destructive font-mono text-sm">500</code>
                  <div>
                    <p className="font-semibold">Internal Server Error</p>
                    <p className="text-sm text-muted-foreground">Something went wrong on our end</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
