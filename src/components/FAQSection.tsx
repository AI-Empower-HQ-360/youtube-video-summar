import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Question } from '@phosphor-icons/react';

export default function FAQSection() {
  const faqs = [
    {
      question: "How does VidNote work?",
      answer: "Simply paste any YouTube video URL into the input field and click Generate. VidNote automatically extracts the video's transcript, then uses advanced AI to create a comprehensive summary, key takeaways, and relevant Q&A pairs in seconds."
    },
    {
      question: "What types of videos work with VidNote?",
      answer: "VidNote works with any YouTube video that has captions or subtitles enabled. This includes auto-generated captions and manually added subtitles in any language. Educational content, tutorials, lectures, interviews, and documentaries work best."
    },
    {
      question: "Do I need to create an account to use VidNote?",
      answer: "No! You can start using VidNote immediately without signing up. However, creating a free account gives you access to additional features like saving your notes, viewing history, and tracking your daily usage limits."
    },
    {
      question: "How many videos can I process?",
      answer: "Free users can process 1 video per day. Basic plan ($22) offers 10 videos per day with history saved for 30 days. Pro plan ($45) includes unlimited videos, lifetime history, priority processing, and advanced features like PDF export."
    },
    {
      question: "Can I download or save the generated content?",
      answer: "Yes! You can copy any section (Summary, Key Points, or Q&A) directly to your clipboard with one click. Pro users also get PDF export functionality to save beautifully formatted notes for offline use or sharing."
    },
    {
      question: "What languages are supported?",
      answer: "VidNote currently works best with English videos. However, if a video has English captions or subtitles (even if the spoken language is different), our AI can process it. We're actively working on expanding language support."
    },
    {
      question: "How accurate are the summaries?",
      answer: "Our AI-powered system provides highly accurate summaries by analyzing the complete video transcript. The quality depends on the clarity of the video's captions. For best results, use videos with clear audio and accurate subtitles."
    },
    {
      question: "Can I use VidNote for my online courses or business?",
      answer: "Absolutely! VidNote is perfect for students, educators, content creators, and professionals. Our Pro plan is ideal for teams and businesses. Contact us for custom enterprise solutions with team management and API access."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes, we take privacy seriously. We don't store video transcripts or generated content beyond your session unless you have an account and choose to save them. All data is encrypted, and we never share your information with third parties."
    },
    {
      question: "What if the video doesn't have captions?",
      answer: "Unfortunately, VidNote requires captions or subtitles to work. Most YouTube videos have auto-generated captions enabled. If a video doesn't have captions, you'll see an error message. Consider requesting the video creator to enable captions."
    }
  ];

  return (
    <section id="faq" className="container mx-auto px-6 md:px-12 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Question size={32} weight="fill" className="text-accent" />
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about VidNote. Can't find your answer? Contact us directly.
        </p>
      </div>

      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-base">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
