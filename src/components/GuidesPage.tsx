import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, GraduationCap, Lightbulb, Rocket, Users } from '@phosphor-icons/react';

interface GuidesPageProps {
  onBack: () => void;
}

export default function GuidesPage({ onBack }: GuidesPageProps) {
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
            <Lightbulb size={32} weight="fill" className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Guides & Tutorials</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Learn how to get the most out of VidNote
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <GraduationCap size={24} weight="fill" className="text-primary" />
              </div>
              <CardTitle>For Students</CardTitle>
              <CardDescription>Master your studies with VidNote</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Rocket size={24} weight="fill" className="text-accent" />
              </div>
              <CardTitle>For Professionals</CardTitle>
              <CardDescription>Accelerate your learning and career</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Users size={24} weight="fill" className="text-primary" />
              </div>
              <CardTitle>For Content Creators</CardTitle>
              <CardDescription>Repurpose video content efficiently</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Lightbulb size={24} weight="fill" className="text-accent" />
              </div>
              <CardTitle>Tips & Tricks</CardTitle>
              <CardDescription>Advanced techniques and shortcuts</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap weight="fill" className="text-primary" />
                Study Guide: Using VidNote for Exam Prep
              </CardTitle>
              <CardDescription>A comprehensive guide for students</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Step 1: Gather Your Video Resources</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Start by collecting YouTube videos related to your course topics. Look for:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Lecture recordings from your professors</li>
                  <li>• Educational channels like Khan Academy, Crash Course, or MIT OpenCourseWare</li>
                  <li>• Topic-specific tutorials and explanations</li>
                  <li>• Review videos covering exam-relevant material</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Step 2: Process Videos with VidNote</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  For each video:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Copy the YouTube URL and paste it into VidNote</li>
                  <li>• Click "Generate" and wait for the AI to process</li>
                  <li>• Review the summary to understand the main concepts</li>
                  <li>• Copy the key points to your study notes</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Step 3: Create Study Materials</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Use the generated content to build comprehensive study materials:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Combine summaries from multiple videos into topic overviews</li>
                  <li>• Use key points as flashcard content</li>
                  <li>• Save Q&A pairs for self-testing</li>
                  <li>• Organize by topic or chapter</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Step 4: Active Recall Practice</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Test yourself using the generated questions:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Read each question and try to answer before revealing</li>
                  <li>• Check your answer against the AI-generated response</li>
                  <li>• Flag questions you struggle with for review</li>
                  <li>• Repeat regularly using spaced repetition</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Step 5: Pre-Exam Review</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  In the days before your exam:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Review all summaries for a quick overview</li>
                  <li>• Focus on key points you've highlighted</li>
                  <li>• Test yourself with saved Q&A pairs</li>
                  <li>• Process any last-minute review videos</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket weight="fill" className="text-accent" />
                Professional Guide: Learning New Skills Faster
              </CardTitle>
              <CardDescription>Optimize your professional development</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Skill Acquisition Strategy</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  When learning a new technology, framework, or professional skill:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Find 3-5 high-quality overview videos (20-60 minutes each)</li>
                  <li>• Process them all with VidNote to create a knowledge base</li>
                  <li>• Compare key points across videos to identify core concepts</li>
                  <li>• Use Q&A sections to understand different perspectives</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Interview Preparation</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Prepare for technical or professional interviews efficiently:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Find interview preparation videos for your field</li>
                  <li>• Generate Q&A pairs from multiple sources</li>
                  <li>• Practice answering questions out loud</li>
                  <li>• Create a master document of common questions and answers</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Conference Talk Summaries</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Stay current with industry trends without watching hours of content:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Process talks from conferences you couldn't attend</li>
                  <li>• Extract key takeaways and action items</li>
                  <li>• Share summaries with your team</li>
                  <li>• Build a knowledge repository for your organization</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users weight="fill" className="text-primary" />
                Creator Guide: Repurposing Video Content
              </CardTitle>
              <CardDescription>Transform videos into multiple content formats</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Blog Post Creation</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Turn your YouTube videos into written content:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Process your video with VidNote</li>
                  <li>• Use the summary as your article outline</li>
                  <li>• Expand each key point into a section</li>
                  <li>• Add the Q&A section as FAQs at the end</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Social Media Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Extract shareable snippets from longer videos:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Use key points as tweet threads or LinkedIn posts</li>
                  <li>• Turn Q&A pairs into Instagram carousel posts</li>
                  <li>• Create quote graphics from interesting insights</li>
                  <li>• Share bite-sized tips across platforms</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Newsletter Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Keep your audience informed with minimal effort:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li>• Summarize your latest videos in your newsletter</li>
                  <li>• Include key takeaways for readers who prefer text</li>
                  <li>• Link back to the full video for those who want more</li>
                  <li>• Save hours of writing time each week</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb weight="fill" className="text-accent" />
                Pro Tips & Advanced Techniques
              </CardTitle>
              <CardDescription>Get more out of VidNote</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent font-bold">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Process Multiple Videos on Related Topics</h4>
                  <p className="text-muted-foreground text-sm">
                    Generate content from 3-5 videos on the same subject and combine the key points to create comprehensive study guides with multiple perspectives.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent font-bold">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Use the Copy Button Efficiently</h4>
                  <p className="text-muted-foreground text-sm">
                    Click the copy button on each section to quickly transfer content to your note-taking app, Google Docs, or Notion. Build your knowledge base incrementally.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent font-bold">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Best Video Types for VidNote</h4>
                  <p className="text-muted-foreground text-sm">
                    Educational lectures, tutorials, how-to guides, conference talks, and interviews work best. Avoid music videos, vlogs, or content with minimal dialogue.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent font-bold">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Optimal Video Length</h4>
                  <p className="text-muted-foreground text-sm">
                    Videos between 10-45 minutes typically provide the best balance of content depth and processing speed. Very short videos may not have enough content for meaningful summaries.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent font-bold">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Verify Important Information</h4>
                  <p className="text-muted-foreground text-sm">
                    While our AI is highly accurate, always verify critical facts or information that you'll use for important decisions or exams against the original video or additional sources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
