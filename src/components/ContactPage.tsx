import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Envelope, MapPin, Phone } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
  };

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
            <Envelope size={32} weight="fill" className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Contact Us</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Envelope size={24} weight="fill" className="text-primary" />
              </div>
              <CardTitle>Email Us</CardTitle>
              <CardDescription>Our team typically responds within 24 hours</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">General Inquiries:</p>
              <p className="font-medium mb-3">hello@vidnote.com</p>
              <p className="text-sm text-muted-foreground mb-2">Support:</p>
              <p className="font-medium">support@vidnote.com</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <MapPin size={24} weight="fill" className="text-accent" />
              </div>
              <CardTitle>Visit Us</CardTitle>
              <CardDescription>Come say hello at our office</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed">
                VidNote HQ<br />
                123 Learning Street<br />
                San Francisco, CA 94102<br />
                United States
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Phone size={24} weight="fill" className="text-primary" />
              </div>
              <CardTitle>Call Us</CardTitle>
              <CardDescription>Monday to Friday, 9am to 6pm PST</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Phone:</p>
              <p className="font-medium mb-3">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground mb-2">Fax:</p>
              <p className="font-medium">+1 (555) 123-4568</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name *</Label>
                  <Input 
                    id="contact-name" 
                    placeholder="Your name" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input 
                    id="contact-email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subject *</Label>
                  <Input 
                    id="contact-subject" 
                    placeholder="What is this about?" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message *</Label>
                  <Textarea 
                    id="contact-message" 
                    placeholder="Tell us more about your inquiry..." 
                    rows={6}
                    required 
                  />
                </div>

                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Frequently Contacted Departments</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Sales & Pricing</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Questions about plans, pricing, or enterprise solutions
                  </p>
                  <a href="mailto:sales@vidnote.com" className="text-sm text-primary hover:underline">
                    sales@vidnote.com
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Technical Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Help with account issues, bugs, or technical problems
                  </p>
                  <a href="mailto:support@vidnote.com" className="text-sm text-primary hover:underline">
                    support@vidnote.com
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Partnerships</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Interested in partnering with VidNote
                  </p>
                  <a href="mailto:partners@vidnote.com" className="text-sm text-primary hover:underline">
                    partners@vidnote.com
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Press & Media</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Press inquiries and media resources
                  </p>
                  <a href="mailto:press@vidnote.com" className="text-sm text-primary hover:underline">
                    press@vidnote.com
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Legal & Privacy</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Legal matters, privacy concerns, or data requests
                  </p>
                  <a href="mailto:legal@vidnote.com" className="text-sm text-primary hover:underline">
                    legal@vidnote.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Before You Contact Us</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  You might find the answer to your question faster by checking these resources:
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={onBack}>
                    FAQ Section
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={onBack}>
                    Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={onBack}>
                    Guides & Tutorials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-2 shadow-lg mt-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Response Time</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">&lt; 24h</div>
                <p className="text-sm text-muted-foreground">
                  Average response time for support tickets
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">95%</div>
                <p className="text-sm text-muted-foreground">
                  Customer satisfaction rate
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">
                  Email support availability
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
