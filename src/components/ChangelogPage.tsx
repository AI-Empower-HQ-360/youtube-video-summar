import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Sparkle,
  CheckCircle,
  Wrench,
  Bug,
  Rocket,
  Plus
} from '@phosphor-icons/react';

interface ChangelogPageProps {
  onBack: () => void;
}

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: {
    type: 'feature' | 'improvement' | 'fix' | 'breaking';
    description: string;
  }[];
}

export default function ChangelogPage({ onBack }: ChangelogPageProps) {
  const changelog: ChangelogEntry[] = [
    {
      version: '1.3.0',
      date: 'January 2025',
      type: 'minor',
      changes: [
        { type: 'feature', description: 'Added Features page showcasing all VidNote capabilities' },
        { type: 'feature', description: 'Added Changelog page to track product updates' },
        { type: 'feature', description: 'Improved navigation with dedicated pages for features and updates' },
        { type: 'improvement', description: 'Enhanced UI consistency across all pages' }
      ]
    },
    {
      version: '1.2.0',
      date: 'January 2025',
      type: 'minor',
      changes: [
        { type: 'feature', description: 'Added yearly billing option with 20% discount' },
        { type: 'feature', description: 'Implemented secure checkout page with card payment support' },
        { type: 'feature', description: 'Added billing address collection during checkout' },
        { type: 'improvement', description: 'Enhanced pricing section with monthly/yearly toggle' }
      ]
    },
    {
      version: '1.1.0',
      date: 'January 2025',
      type: 'minor',
      changes: [
        { type: 'feature', description: 'Added FAQ section with expandable answers' },
        { type: 'feature', description: 'Implemented user dashboard with usage statistics' },
        { type: 'feature', description: 'Added Gmail-based authentication system' },
        { type: 'feature', description: 'Created user profile dropdown menu' },
        { type: 'improvement', description: 'Improved footer with social links and navigation' }
      ]
    },
    {
      version: '1.0.0',
      date: 'January 2025',
      type: 'major',
      changes: [
        { type: 'feature', description: 'Launched VidNote with core AI-powered video summarization' },
        { type: 'feature', description: 'YouTube video transcript extraction and processing' },
        { type: 'feature', description: 'AI-generated summaries with GPT-4 integration' },
        { type: 'feature', description: 'Key points extraction from video content' },
        { type: 'feature', description: 'Q&A generation for study and interview prep' },
        { type: 'feature', description: 'One-click copy functionality for all content sections' },
        { type: 'feature', description: 'Responsive design with dark theme' },
        { type: 'feature', description: 'Pricing tiers: Free, Basic ($22/mo), and Pro ($45/mo)' }
      ]
    },
    {
      version: '0.9.0',
      date: 'December 2024',
      type: 'minor',
      changes: [
        { type: 'feature', description: 'Beta launch with limited user testing' },
        { type: 'feature', description: 'Basic YouTube URL parsing and validation' },
        { type: 'feature', description: 'Initial AI summary generation prototype' },
        { type: 'improvement', description: 'Performance optimization for large video transcripts' }
      ]
    },
    {
      version: '0.5.0',
      date: 'November 2024',
      type: 'minor',
      changes: [
        { type: 'feature', description: 'Alpha version with core concept validation' },
        { type: 'feature', description: 'Basic UI design and layout structure' },
        { type: 'feature', description: 'Initial YouTube API integration' },
        { type: 'improvement', description: 'Setup development environment and tooling' }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Plus size={16} weight="bold" className="text-accent" />;
      case 'improvement':
        return <Wrench size={16} weight="fill" className="text-primary" />;
      case 'fix':
        return <Bug size={16} weight="fill" className="text-destructive" />;
      case 'breaking':
        return <Rocket size={16} weight="fill" className="text-orange-500" />;
      default:
        return <CheckCircle size={16} weight="fill" className="text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'feature':
        return 'New';
      case 'improvement':
        return 'Improved';
      case 'fix':
        return 'Fixed';
      case 'breaking':
        return 'Breaking';
      default:
        return 'Change';
    }
  };

  const getVersionBadgeVariant = (type: 'major' | 'minor' | 'patch') => {
    switch (type) {
      case 'major':
        return 'default';
      case 'minor':
        return 'secondary';
      case 'patch':
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-4xl">
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkle size={40} weight="fill" className="text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Changelog
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track every update, feature, and improvement to VidNote
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {changelog.map((entry, idx) => (
            <Card key={idx} className="border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl font-bold">v{entry.version}</CardTitle>
                    <Badge variant={getVersionBadgeVariant(entry.type)} className="capitalize">
                      {entry.type} Release
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{entry.date}</CardDescription>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {entry.changes.map((change, changeIdx) => (
                    <li key={changeIdx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-md bg-secondary flex items-center justify-center mt-0.5">
                        {getTypeIcon(change.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-0 h-5"
                          >
                            {getTypeLabel(change.type)}
                          </Badge>
                          <p className="text-sm leading-relaxed flex-1">{change.description}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-12">
          <Card className="border-2 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
            <CardContent className="p-8 text-center">
              <Rocket size={48} weight="fill" className="text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">
                More Updates Coming Soon
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We're constantly improving VidNote based on user feedback. Stay tuned for exciting new features!
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <Badge variant="secondary" className="px-4 py-2">
                  🎯 Playlist support
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  📱 Mobile app
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  🤝 Team collaboration
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  🔗 Browser extension
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
