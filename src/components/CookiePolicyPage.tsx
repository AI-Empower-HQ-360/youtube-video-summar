import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Cookie } from '@phosphor-icons/react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CookiePolicyPageProps {
  onBack: () => void;
}

export default function CookiePolicyPage({ onBack }: CookiePolicyPageProps) {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-4xl">
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
            <Cookie size={32} weight="fill" className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 20, 2024</p>
        </div>

        <Card className="border-2 shadow-lg mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Cookie Preferences</h2>
            <p className="text-muted-foreground mb-6">
              Manage your cookie preferences below. Essential cookies cannot be disabled as they are necessary for the website to function.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex-1">
                  <Label htmlFor="essential" className="text-base font-semibold">Essential Cookies</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Required for basic site functionality and security
                  </p>
                </div>
                <Switch id="essential" checked disabled />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="text-base font-semibold">Analytics Cookies</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Help us understand how visitors use our website
                  </p>
                </div>
                <Switch id="analytics" />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="marketing" className="text-base font-semibold">Marketing Cookies</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Used to deliver personalized advertisements
                  </p>
                </div>
                <Switch id="marketing" />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button>Save Preferences</Button>
              <Button variant="outline">Accept All</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, provide information to website owners, and improve your browsing experience.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                VidNote uses cookies for the following purposes:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• To keep you signed in and remember your preferences</li>
                <li>• To understand how you use our service</li>
                <li>• To improve performance and user experience</li>
                <li>• To provide security and prevent fraud</li>
                <li>• To analyze site traffic and usage patterns</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-lg font-semibold mb-3 mt-6">1. Essential Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These cookies are necessary for the website to function and cannot be switched off:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• <strong>Authentication:</strong> Keep you logged in as you navigate the site</li>
                <li>• <strong>Security:</strong> Protect against cross-site request forgery</li>
                <li>• <strong>Session:</strong> Maintain your session state across pages</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">2. Analytics Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These cookies help us understand how visitors interact with VidNote:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• <strong>Usage Statistics:</strong> Track which features are used most</li>
                <li>• <strong>Performance:</strong> Monitor page load times and errors</li>
                <li>• <strong>User Journey:</strong> Understand navigation patterns</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">3. Functional Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These cookies enable enhanced functionality and personalization:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• <strong>Preferences:</strong> Remember your settings and choices</li>
                <li>• <strong>Language:</strong> Store your preferred language</li>
                <li>• <strong>Theme:</strong> Remember your display preferences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">4. Marketing Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These cookies are used to deliver relevant advertisements:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• <strong>Advertising:</strong> Show relevant ads based on interests</li>
                <li>• <strong>Retargeting:</strong> Display ads for VidNote on other sites</li>
                <li>• <strong>Campaign Tracking:</strong> Measure advertising effectiveness</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Some cookies are placed by third-party services that appear on our pages:
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    We use Google Analytics to analyze website traffic and user behavior. This helps us improve our service.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Payment Processors</h4>
                  <p className="text-sm text-muted-foreground">
                    When you make a payment, our payment processor may set cookies to process transactions securely.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">YouTube</h4>
                  <p className="text-sm text-muted-foreground">
                    When displaying video information, YouTube may set cookies according to their privacy policy.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Cookie Duration</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Cookies can be either session cookies or persistent cookies:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• <strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li>• <strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Most of our cookies are persistent and remain for periods ranging from 30 days to 2 years, depending on their purpose.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You can control and manage cookies in several ways:
              </p>

              <h3 className="text-lg font-semibold mb-3 mt-6">Browser Settings</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Most browsers allow you to:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• View cookies stored on your device</li>
                <li>• Delete all cookies or specific cookies</li>
                <li>• Block third-party cookies</li>
                <li>• Block cookies from specific sites</li>
                <li>• Block all cookies (not recommended)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">Opt-Out Links</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You can opt out of certain third-party cookies:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Google Analytics: Use the Google Analytics Opt-out Browser Add-on</li>
                <li>• Advertising cookies: Visit the Network Advertising Initiative opt-out page</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Note: Blocking all cookies may prevent you from using some features of VidNote.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Do Not Track</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some browsers include a Do Not Track feature. Currently, there is no industry standard for how to respond to Do Not Track signals. VidNote does not currently respond to Do Not Track browser signals, but we respect your cookie preferences set through our cookie preference center.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. We will notify you of any significant changes by posting a notice on our website or through email.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have questions about our use of cookies, please contact us:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Email: privacy@vidnote.com</li>
                <li>• Address: VidNote, 123 Learning Street, San Francisco, CA 94102</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
