import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShieldCheck } from '@phosphor-icons/react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export default function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
            <ShieldCheck size={32} weight="fill" className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 20, 2024</p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At VidNote, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              
              <h3 className="text-lg font-semibold mb-3 mt-6">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When you create an account, we may collect the following information:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Email address</li>
                <li>• Name (if provided)</li>
                <li>• Account credentials</li>
                <li>• Payment information (processed securely through third-party payment providers)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-6">Usage Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We automatically collect certain information when you use VidNote:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• YouTube video URLs you process</li>
                <li>• Generated summaries, key points, and Q&A content</li>
                <li>• Usage statistics and frequency</li>
                <li>• Browser type and version</li>
                <li>• Device information</li>
                <li>• IP address</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• To provide, maintain, and improve our service</li>
                <li>• To process your requests and generate content</li>
                <li>• To manage your account and subscriptions</li>
                <li>• To send you updates, security alerts, and support messages</li>
                <li>• To analyze usage patterns and improve user experience</li>
                <li>• To prevent fraud and ensure security</li>
                <li>• To comply with legal obligations</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• Encrypted data transmission using SSL/TLS</li>
                <li>• Secure password storage using industry-standard hashing</li>
                <li>• Regular security audits and updates</li>
                <li>• Limited access to personal data by authorized personnel only</li>
                <li>• Secure cloud storage with reputable providers</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• With service providers who help us operate our business (e.g., payment processors, hosting providers)</li>
                <li>• To comply with legal obligations or respond to lawful requests</li>
                <li>• To protect our rights, privacy, safety, or property</li>
                <li>• In connection with a business transfer, merger, or acquisition</li>
                <li>• With your explicit consent</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                VidNote integrates with third-party services:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• <strong>YouTube:</strong> We retrieve video transcripts and metadata from YouTube. Your use of YouTube content is subject to YouTube Terms of Service.</li>
                <li>• <strong>OpenAI:</strong> We use AI services to generate summaries and content. Video transcripts are processed by AI models.</li>
                <li>• <strong>Payment Processors:</strong> Payment information is handled by third-party payment processors and is not stored on our servers.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Your Privacy Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li>• <strong>Access:</strong> Request access to your personal information</li>
                <li>• <strong>Correction:</strong> Request correction of inaccurate data</li>
                <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
                <li>• <strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                <li>• <strong>Opt-Out:</strong> Opt out of marketing communications</li>
                <li>• <strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@vidnote.com
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                VidNote is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the Last Updated date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any questions about this Privacy Policy, please contact us:
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
