import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Book, Code, Sparkle, YoutubeLogo, Lightning } from '@phosphor-icons/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DocumentationPageProps {
  onBack: () => void;
}

export default function DocumentationPage({ onBack }: DocumentationPageProps) {
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
            <Book size={32} weight="fill" className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Documentation</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about using VidNote
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightning weight="fill" className="text-accent" />
                Getting Started
              </CardTitle>
              <CardDescription>Quick guide to using VidNote</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Step 1: Find a YouTube Video</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Navigate to YouTube and find any video you want to learn from. The video must have captions or subtitles enabled to work with VidNote.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Step 2: Copy the Video URL</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Copy the video URL from your browser's address bar. VidNote supports multiple URL formats:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <code className="bg-muted px-2 py-1 rounded text-sm">https://www.youtube.com/watch?v=VIDEO_ID</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <code className="bg-muted px-2 py-1 rounded text-sm">https://youtu.be/VIDEO_ID</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <code className="bg-muted px-2 py-1 rounded text-sm">https://www.youtube.com/embed/VIDEO_ID</code>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Step 3: Paste and Generate</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Paste the URL into the input field on the VidNote homepage and click the "Generate" button. Our AI will process the video and extract key information within seconds.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Step 4: Review Your Results</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Once processing is complete, you'll receive three sections:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <strong className="text-foreground">Summary:</strong> A comprehensive overview of the video content
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <strong className="text-foreground">Key Points:</strong> Bullet-point highlights of main concepts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <strong className="text-foreground">Q&A:</strong> Study questions with detailed answers
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkle weight="fill" className="text-accent" />
                Features Overview
              </CardTitle>
              <CardDescription>Understanding VidNote's capabilities</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>AI-Powered Summaries</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    VidNote uses advanced AI models to analyze video transcripts and generate human-like summaries. The AI identifies key themes, main arguments, and important details to create concise overviews that capture the essence of the video.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Smart Key Point Extraction</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Our system automatically identifies and extracts the most important takeaways from videos. These are presented as numbered bullet points for easy scanning and note-taking.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Interactive Q&A Generation</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    VidNote creates relevant questions and comprehensive answers based on the video content. This feature is perfect for studying, exam preparation, or testing your understanding of the material.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Copy to Clipboard</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Each section (Summary, Key Points, Q&A) includes a copy button for easy export to your notes, documents, or study materials. Simply click the copy icon to save the content.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Video Information Display</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    When you process a video, VidNote displays the video thumbnail and title for easy reference, ensuring you're working with the correct content.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code weight="fill" className="text-accent" />
                Best Practices
              </CardTitle>
              <CardDescription>Tips for optimal results</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Choose Videos with Captions</h4>
                  <p className="text-muted-foreground text-sm">
                    VidNote works best with videos that have accurate captions or subtitles. Auto-generated captions work fine, but manually created captions provide better results.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ideal Video Length</h4>
                  <p className="text-muted-foreground text-sm">
                    While VidNote can process videos of any length, videos between 5-60 minutes typically provide the most comprehensive and useful results.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Educational Content Works Best</h4>
                  <p className="text-muted-foreground text-sm">
                    VidNote excels with educational, tutorial, lecture, and informational content. Music videos, vlogs, or entertainment content may not produce meaningful results.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Review and Verify</h4>
                  <p className="text-muted-foreground text-sm">
                    Always review AI-generated content for accuracy. While our system is highly reliable, it's good practice to verify important information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <YoutubeLogo weight="fill" className="text-accent" />
                Troubleshooting
              </CardTitle>
              <CardDescription>Common issues and solutions</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="trouble-1">
                  <AccordionTrigger>"Invalid URL" Error</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed space-y-2">
                    <p>Make sure you're using a valid YouTube URL format. Check that:</p>
                    <ul className="ml-6 space-y-1">
                      <li>• The URL is from youtube.com or youtu.be</li>
                      <li>• The URL includes a video ID</li>
                      <li>• There are no extra characters or spaces</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="trouble-2">
                  <AccordionTrigger>"Transcript Unavailable" Error</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    This means the video doesn't have captions enabled. Try a different video, or contact the video creator to enable captions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="trouble-3">
                  <AccordionTrigger>Processing Takes Too Long</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Very long videos (over 2 hours) may take longer to process. Wait a few moments, or try a shorter video. If the issue persists, refresh the page and try again.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="trouble-4">
                  <AccordionTrigger>Results Don't Make Sense</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    This can happen with videos that have poor quality captions, music videos, or content with minimal dialogue. VidNote works best with clear, educational content.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
