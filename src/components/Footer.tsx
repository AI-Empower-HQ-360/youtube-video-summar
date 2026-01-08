import { Sparkle, GithubLogo, TwitterLogo, EnvelopeSimple } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';

interface FooterProps {
  onNavigateFeatures?: () => void;
  onNavigateChangelog?: () => void;
}

export default function Footer({ onNavigateFeatures, onNavigateChangelog }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkle size={28} weight="fill" className="text-accent" />
              <h3 className="text-xl font-bold gradient-text">VidNote</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Transform YouTube videos into instant summaries, key points, and study questions with AI-powered intelligence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center"
                aria-label="GitHub"
              >
                <GithubLogo size={20} weight="fill" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center"
                aria-label="Twitter"
              >
                <TwitterLogo size={20} weight="fill" />
              </a>
              <a
                href="mailto:hello@vidnote.app"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center"
                aria-label="Email"
              >
                <EnvelopeSimple size={20} weight="fill" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-foreground">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                {onNavigateFeatures ? (
                  <button
                    onClick={onNavigateFeatures}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    Features
                  </button>
                ) : (
                  <a
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    Features
                  </a>
                )}
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                {onNavigateChangelog ? (
                  <button
                    onClick={onNavigateChangelog}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    Changelog
                  </button>
                ) : (
                  <a
                    href="#changelog"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    Changelog
                  </a>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-foreground">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#docs"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#api"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#guides"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Guides & Tutorials
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-foreground">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#privacy"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#cookies"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} VidNote. All rights reserved. Made with{' '}
            <span className="text-accent">❤</span> for learners worldwide.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#status" className="hover:text-accent transition-colors">
              Status
            </a>
            <span className="text-border">•</span>
            <a href="#security" className="hover:text-accent transition-colors">
              Security
            </a>
            <span className="text-border">•</span>
            <a href="#accessibility" className="hover:text-accent transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
