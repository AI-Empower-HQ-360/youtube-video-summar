import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Article, Calendar, User } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';

interface BlogPageProps {
  onBack: () => void;
}

export default function BlogPage({ onBack }: BlogPageProps) {
  const blogPosts = [
    {
      id: 1,
      title: 'How AI is Transforming the Way We Learn',
      excerpt: 'Discover how artificial intelligence is revolutionizing education and making learning more accessible, efficient, and personalized for everyone.',
      date: 'January 15, 2024',
      author: 'VidNote Team',
      category: 'AI & Education',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: '5 Study Techniques That Actually Work',
      excerpt: 'Evidence-based study methods that can help you retain information better and ace your exams. Learn from cognitive science research.',
      date: 'January 10, 2024',
      author: 'Sarah Johnson',
      category: 'Study Tips',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'The Power of Active Recall in Learning',
      excerpt: 'Why testing yourself is more effective than re-reading notes, and how VidNote Q&A feature helps you implement this powerful technique.',
      date: 'January 5, 2024',
      author: 'Dr. Michael Chen',
      category: 'Learning Science',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Maximizing Your Learning from Online Videos',
      excerpt: 'A comprehensive guide to getting the most educational value from YouTube and other video platforms.',
      date: 'December 28, 2023',
      author: 'VidNote Team',
      category: 'Productivity',
      readTime: '8 min read'
    }
  ];

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
            <Article size={32} weight="fill" className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Blog</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Insights, tips, and stories about learning, productivity, and AI
          </p>
        </div>

        <Card className="border-2 shadow-lg mb-8">
          <CardHeader>
            <Badge className="w-fit mb-2">Featured Post</Badge>
            <CardTitle className="text-2xl">
              Introducing VidNote: Your AI Learning Companion
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-base mt-2">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                January 20, 2024
              </span>
              <span className="flex items-center gap-1">
                <User size={16} />
                VidNote Team
              </span>
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed mb-4">
              We're excited to announce the launch of VidNote, a revolutionary tool designed to transform how you learn from video content. In today's world, knowledge is increasingly shared through video platforms like YouTube, but watching lengthy videos can be time-consuming and inefficient.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              VidNote leverages cutting-edge AI technology to extract the essence of any YouTube video in seconds. Whether you're a student preparing for exams, a professional upskilling, or a curious learner exploring new topics, VidNote helps you learn faster and retain information better.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our mission is simple: make learning accessible, efficient, and enjoyable for everyone. We believe that knowledge should be easy to consume, and with VidNote, it is.
            </p>
            <Button variant="outline">Read Full Article</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recent Posts</h2>
          
          {blogPosts.map((post) => (
            <Card key={post.id} className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {post.author}
                  </span>
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <Button variant="ghost" className="gap-2">
                  Read More
                  <ArrowLeft className="rotate-180" weight="bold" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2 shadow-lg mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Want to contribute?</h3>
              <p className="text-muted-foreground mb-4">
                We're always looking for guest writers to share their insights on learning, education, and technology.
              </p>
              <Button>Get in Touch</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
