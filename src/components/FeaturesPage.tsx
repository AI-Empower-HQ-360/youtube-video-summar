import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Lightning, 
  Article, 
  ListBullets, 
  Question,
  Copy,
  CloudArrowDown,
  Lock,
  Clock,
  Sparkle,
  ChartBar,
  GlobeHemisphereWest,
  Translate,
  MagnifyingGlass,
  BookOpen
} from '@phosphor-icons/react';

interface FeaturesPageProps {
  onBack: () => void;
}

export default function FeaturesPage({ onBack }: FeaturesPageProps) {
  const coreFeatures = [
    {
      icon: Lightning,
      title: 'Instant Video Processing',
      description: 'Paste any YouTube URL and get AI-generated insights in seconds. No waiting, no hassle.',
      benefits: ['Process videos in under 30 seconds', 'Support for videos up to 4 hours long', 'Automatic caption extraction']
    },
    {
      icon: Article,
      title: 'Smart AI Summaries',
      description: 'Get concise, well-structured summaries that capture the essence of any video content.',
      benefits: ['Human-like writing quality', 'Context-aware summaries', 'Perfect for quick learning']
    },
    {
      icon: ListBullets,
      title: 'Key Points Extraction',
      description: 'Automatically identifies and extracts the most important concepts and takeaways.',
      benefits: ['Numbered bullet points', 'Easy to scan format', 'Great for revision notes']
    },
    {
      icon: Question,
      title: 'Q&A Generation',
      description: 'AI creates meaningful questions with detailed answers to test your understanding.',
      benefits: ['Study preparation', 'Interview practice', 'Self-assessment tool']
    }
  ];

  const productivityFeatures = [
    {
      icon: Copy,
      title: 'One-Click Copy',
      description: 'Copy summaries, key points, or Q&A pairs with a single click.',
      highlight: 'All Plans'
    },
    {
      icon: CloudArrowDown,
      title: 'Export to PDF',
      description: 'Download your notes as beautifully formatted PDF documents.',
      highlight: 'Pro Plan'
    },
    {
      icon: ChartBar,
      title: 'Usage Dashboard',
      description: 'Track your learning progress and video processing history.',
      highlight: 'Basic & Pro'
    },
    {
      icon: BookOpen,
      title: 'Saved Library',
      description: 'Access all your processed videos in one organized place.',
      highlight: 'Basic & Pro'
    }
  ];

  const advancedFeatures = [
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared with third parties. We respect your privacy.',
    },
    {
      icon: Clock,
      title: 'Processing History',
      description: 'Keep track of all videos you\'ve processed with timestamps and quick access.',
    },
    {
      icon: GlobeHemisphereWest,
      title: 'Multi-Language Support',
      description: 'Works with videos in multiple languages including English, Spanish, French, and more.',
    },
    {
      icon: Translate,
      title: 'Smart Formatting',
      description: 'Results are formatted for readability with proper structure and emphasis.',
    },
    {
      icon: MagnifyingGlass,
      title: 'Search Your Notes',
      description: 'Quickly find specific topics or concepts across all your saved notes.',
    },
    {
      icon: Sparkle,
      title: 'Continuous Improvements',
      description: 'Regular AI model updates ensure you get the best quality summaries.',
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 mb-6"
          >
            <ArrowLeft weight="bold" />
            Back to Home
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Powerful Features
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform YouTube videos into actionable knowledge
            </p>
          </div>
        </div>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Core Features</h2>
            <p className="text-muted-foreground">The foundation of your learning experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {coreFeatures.map((feature, idx) => (
              <Card key={idx} className="border-2 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon size={24} weight="fill" className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-accent mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Productivity Tools</h2>
            <p className="text-muted-foreground">Work smarter, not harder</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productivityFeatures.map((feature, idx) => (
              <Card key={idx} className="border-2 hover:border-accent/50 transition-colors text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon size={28} weight="fill" className="text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                      {feature.highlight}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Advanced Capabilities</h2>
            <p className="text-muted-foreground">Designed for power users</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                      <feature.icon size={20} weight="fill" className="text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Card className="border-2 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
            <CardContent className="p-8 text-center">
              <Sparkle size={48} weight="fill" className="text-accent mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of students and professionals who are learning smarter with VidNote
              </p>
              <Button
                size="lg"
                onClick={onBack}
                className="gap-2"
              >
                Get Started Free
                <ArrowLeft weight="bold" className="rotate-180" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
