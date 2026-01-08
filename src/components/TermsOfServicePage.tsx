import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText } from '@phosphor-icons/react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export default function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
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
            <FileText size={32} weight="fill" className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 20, 2024</p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service constitute a legally binding agreement between you and VidNote. By accessing or using VidNote, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the service.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                VidNote is an AI-powered service that processes YouTube video content to generate summaries, key points, and question-answer pairs. Our service:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Extracts transcripts from publicly available YouTube videos</li>
                <li>• Uses artificial intelligence to analyze and summarize content</li>
                <li>• Provides educational tools to enhance learning</li>
                <li>• Offers both free and paid subscription tiers</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree to use VidNote only for lawful purposes. You may not:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe on intellectual property rights</li>
                <li>• Attempt to circumvent usage limits or payment requirements</li>
                <li>• Use automated systems to access the service excessively</li>
                <li>• Reverse engineer or attempt to extract source code</li>
                <li>• Share account credentials with others</li>
                <li>• Use the service to create competing products</li>
                <li>• Process videos containing illegal or harmful content</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When you create an account with us:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• You must provide accurate and complete information</li>
                <li>• You are responsible for maintaining account security</li>
                <li>• You are responsible for all activities under your account</li>
                <li>• You must notify us immediately of unauthorized access</li>
                <li>• We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Subscription Plans and Payment</h2>
              
              <h3 className="text-lg font-semibold mb-3 mt-6">Free Plan</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our free plan provides limited access to VidNote features. We reserve the right to modify or discontinue the free plan at any time.
              </p>

              <h3 className="text-lg font-semibold mb-3 mt-6">Paid Plans</h3>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Subscription fees are billed in advance on a monthly or annual basis</li>
                <li>• Payment is due at the time of purchase</li>
                <li>• Subscriptions automatically renew unless canceled</li>
                <li>• Prices are subject to change with 30 days notice</li>
                <li>• Refunds are provided according to our refund policy</li>
                <li>• Failed payments may result in service suspension</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">Refund Policy</h3>
              <p className="text-muted-foreground leading-relaxed">
                We offer a 14-day money-back guarantee for new subscriptions. Refund requests must be submitted within 14 days of purchase. Annual subscriptions may be refunded on a pro-rata basis at our discretion.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              
              <h3 className="text-lg font-semibold mb-3 mt-6">Our Rights</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                VidNote and its original content, features, and functionality are owned by VidNote and are protected by international copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-semibold mb-3 mt-6">Your Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Content generated through VidNote based on YouTube videos:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• You retain rights to content you generate through our service</li>
                <li>• You grant us a license to store and process your content to provide the service</li>
                <li>• You are responsible for ensuring you have rights to process source videos</li>
                <li>• Generated content should be used for personal or educational purposes</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Third-Party Content</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                VidNote processes content from YouTube and other third-party sources. You acknowledge that:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• You must comply with YouTube Terms of Service</li>
                <li>• VidNote is not responsible for the accuracy of source content</li>
                <li>• You must respect the intellectual property rights of video creators</li>
                <li>• Generated summaries are for personal use and research</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Disclaimers</h2>
              
              <h3 className="text-lg font-semibold mb-3 mt-6">Service Availability</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                VidNote is provided as-is and as-available. We do not guarantee:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Uninterrupted or error-free service</li>
                <li>• Accuracy or completeness of generated content</li>
                <li>• Availability of specific videos or content</li>
                <li>• Compatibility with all devices or browsers</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">AI-Generated Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                Content generated by AI may contain errors or inaccuracies. You should verify important information and not rely solely on AI-generated summaries for critical decisions or academic work without verification.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To the maximum extent permitted by law:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• VidNote shall not be liable for indirect, incidental, or consequential damages</li>
                <li>• Our total liability is limited to the amount you paid in the last 12 months</li>
                <li>• We are not liable for loss of data, profits, or business opportunities</li>
                <li>• We are not responsible for third-party content or services</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold VidNote harmless from any claims, damages, or expenses arising from your use of the service, violation of these terms, or infringement of any rights of another party.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may terminate or suspend your account and access to the service:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Immediately for violations of these terms</li>
                <li>• For fraudulent or illegal activity</li>
                <li>• At our discretion with or without notice</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will provide notice of significant changes via email or through the service. Continued use after changes constitutes acceptance of the modified terms.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of San Francisco County, California.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                For questions about these Terms of Service, contact us:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Email: legal@vidnote.com</li>
                <li>• Address: VidNote, 123 Learning Street, San Francisco, CA 94102</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
