import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from '@phosphor-icons/react';

interface PricingSectionProps {
  onSelectPlan?: (plan: { name: string; price: string; period: string }) => void;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for casual learners',
    features: [
      '1 video per day',
      'Videos up to 30 minutes',
      'Summary & key points',
      'Q&A generation',
      'Copy to clipboard',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Basic',
    price: '$22',
    period: 'per month',
    description: 'For regular knowledge seekers',
    features: [
      '50 videos per month',
      'Videos up to 2 hours',
      'Summary & key points',
      'Q&A generation',
      'Copy to clipboard',
      'Video history',
      'Priority processing',
    ],
    cta: 'Upgrade to Basic',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$45',
    period: 'per month',
    description: 'For power users & professionals',
    features: [
      'Unlimited videos',
      'Videos up to 5 hours',
      'Advanced AI processing',
      'Export to PDF',
      'Video history & favorites',
      'Advanced Q&A with difficulty levels',
      'Custom summary length',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    popular: false,
  },
];

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  return (
    <section className="py-20" id="pricing">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                plan.popular
                  ? 'border-accent shadow-xl scale-105 md:scale-110'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-bold rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base mb-6">
                  {plan.description}
                </CardDescription>
                <div className="mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        weight="bold"
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-accent' : 'text-primary'
                        }`}
                        size={20}
                      />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full h-12 font-medium ${
                    plan.popular
                      ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                  size="lg"
                  onClick={() => onSelectPlan?.(plan)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground text-sm">
            All plans include secure processing and privacy protection.{' '}
            <span className="text-foreground font-medium">
              Your data is never stored or shared.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
