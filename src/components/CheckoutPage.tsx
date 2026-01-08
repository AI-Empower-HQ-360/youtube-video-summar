import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Lock, Check } from '@phosphor-icons/react';

interface CheckoutPageProps {
  onBack: () => void;
  selectedPlan: {
    name: string;
    price: string;
    period: string;
  };
}

export default function CheckoutPage({ onBack, selectedPlan }: CheckoutPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      const newErrors = { ...errors };
      delete newErrors.cardNumber;
      setFormData({ ...formData, cardNumber: formatted });
      setErrors(newErrors);
    }
  };

  const handleCvvChange = (value: string) => {
    const v = value.replace(/[^0-9]/gi, '');
    if (v.length <= 4) {
      const newErrors = { ...errors };
      delete newErrors.cvv;
      setFormData({ ...formData, cvv: v });
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Month is required';
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Year is required';
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV is required';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State/Province is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment processed successfully! Welcome to ' + selectedPlan.name);
      setTimeout(() => onBack(), 1500);
    }, 2000);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const months = [
    { value: '01', label: '01 - January' },
    { value: '02', label: '02 - February' },
    { value: '03', label: '03 - March' },
    { value: '04', label: '04 - April' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - June' },
    { value: '07', label: '07 - July' },
    { value: '08', label: '08 - August' },
    { value: '09', label: '09 - September' },
    { value: '10', label: '10 - October' },
    { value: '11', label: '11 - November' },
    { value: '12', label: '12 - December' },
  ];

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Belgium',
    'Switzerland',
    'Austria',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Ireland',
    'New Zealand',
    'Japan',
    'Singapore',
    'India',
    'Brazil',
    'Mexico',
    'Argentina',
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-5xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft weight="bold" />
          Back to Pricing
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={24} weight="fill" className="text-primary" />
                  <CardTitle className="text-2xl">Payment Details</CardTitle>
                </div>
                <CardDescription>
                  Complete your purchase securely. All transactions are encrypted.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard size={20} weight="fill" />
                      Card Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number *</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className={errors.cardNumber ? 'border-destructive' : ''}
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-destructive">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card-name">Cardholder Name *</Label>
                      <Input
                        id="card-name"
                        placeholder="John Doe"
                        value={formData.cardName}
                        onChange={(e) => {
                          const newErrors = { ...errors };
                          delete newErrors.cardName;
                          setFormData({ ...formData, cardName: e.target.value });
                          setErrors(newErrors);
                        }}
                        className={errors.cardName ? 'border-destructive' : ''}
                      />
                      {errors.cardName && (
                        <p className="text-sm text-destructive">{errors.cardName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry-month">Expiry Month *</Label>
                        <Select
                          value={formData.expiryMonth}
                          onValueChange={(value) => {
                            const newErrors = { ...errors };
                            delete newErrors.expiryMonth;
                            setFormData({ ...formData, expiryMonth: value });
                            setErrors(newErrors);
                          }}
                        >
                          <SelectTrigger 
                            id="expiry-month"
                            className={errors.expiryMonth ? 'border-destructive' : ''}
                          >
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.expiryMonth && (
                          <p className="text-sm text-destructive">{errors.expiryMonth}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiry-year">Expiry Year *</Label>
                        <Select
                          value={formData.expiryYear}
                          onValueChange={(value) => {
                            const newErrors = { ...errors };
                            delete newErrors.expiryYear;
                            setFormData({ ...formData, expiryYear: value });
                            setErrors(newErrors);
                          }}
                        >
                          <SelectTrigger 
                            id="expiry-year"
                            className={errors.expiryYear ? 'border-destructive' : ''}
                          >
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.expiryYear && (
                          <p className="text-sm text-destructive">{errors.expiryYear}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleCvvChange(e.target.value)}
                          className={errors.cvv ? 'border-destructive' : ''}
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-destructive">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Billing Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          const newErrors = { ...errors };
                          delete newErrors.email;
                          setFormData({ ...formData, email: e.target.value });
                          setErrors(newErrors);
                        }}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address-line1">Address Line 1 *</Label>
                      <Input
                        id="address-line1"
                        placeholder="123 Main Street"
                        value={formData.addressLine1}
                        onChange={(e) => {
                          const newErrors = { ...errors };
                          delete newErrors.addressLine1;
                          setFormData({ ...formData, addressLine1: e.target.value });
                          setErrors(newErrors);
                        }}
                        className={errors.addressLine1 ? 'border-destructive' : ''}
                      />
                      {errors.addressLine1 && (
                        <p className="text-sm text-destructive">{errors.addressLine1}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address-line2">Address Line 2</Label>
                      <Input
                        id="address-line2"
                        placeholder="Apartment, suite, etc. (optional)"
                        value={formData.addressLine2}
                        onChange={(e) =>
                          setFormData({ ...formData, addressLine2: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => {
                            const newErrors = { ...errors };
                            delete newErrors.city;
                            setFormData({ ...formData, city: e.target.value });
                            setErrors(newErrors);
                          }}
                          className={errors.city ? 'border-destructive' : ''}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State / Province *</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={formData.state}
                          onChange={(e) => {
                            const newErrors = { ...errors };
                            delete newErrors.state;
                            setFormData({ ...formData, state: e.target.value });
                            setErrors(newErrors);
                          }}
                          className={errors.state ? 'border-destructive' : ''}
                        />
                        {errors.state && (
                          <p className="text-sm text-destructive">{errors.state}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip-code">ZIP / Postal Code *</Label>
                        <Input
                          id="zip-code"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={(e) => {
                            const newErrors = { ...errors };
                            delete newErrors.zipCode;
                            setFormData({ ...formData, zipCode: e.target.value });
                            setErrors(newErrors);
                          }}
                          className={errors.zipCode ? 'border-destructive' : ''}
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-destructive">{errors.zipCode}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => {
                            const newErrors = { ...errors };
                            delete newErrors.country;
                            setFormData({ ...formData, country: value });
                            setErrors(newErrors);
                          }}
                        >
                          <SelectTrigger 
                            id="country"
                            className={errors.country ? 'border-destructive' : ''}
                          >
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.country && (
                          <p className="text-sm text-destructive">{errors.country}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock size={16} weight="fill" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 gap-2 font-medium"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock weight="fill" />
                        Pay {selectedPlan.price} / {selectedPlan.period}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-2 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{selectedPlan.name} Plan</p>
                    <p className="text-sm text-muted-foreground">
                      Billed {selectedPlan.period}
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{selectedPlan.price}</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total due today</span>
                  <span>{selectedPlan.price}</span>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2 mt-6">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Check weight="bold" className="text-accent" />
                    What's included:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedPlan.name === 'Free' && (
                      <>
                        <li>• 1 video per day</li>
                        <li>• Videos up to 30 minutes</li>
                        <li>• AI summaries & Q&A</li>
                      </>
                    )}
                    {selectedPlan.name === 'Basic' && (
                      <>
                        <li>• 50 videos per month</li>
                        <li>• Videos up to 2 hours</li>
                        <li>• Video history</li>
                        <li>• Priority processing</li>
                      </>
                    )}
                    {selectedPlan.name === 'Pro' && (
                      <>
                        <li>• Unlimited videos</li>
                        <li>• Videos up to 5 hours</li>
                        <li>• Export to PDF</li>
                        <li>• Priority support</li>
                      </>
                    )}
                  </ul>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Cancel anytime. No hidden fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
