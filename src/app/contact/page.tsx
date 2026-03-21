import type { Metadata } from 'next';
import { Mail, Clock, Shield, MessageSquare } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the LumaShift team. We\'ll respond within 24 hours with an honest assessment and next steps tailored to your situation.',
};

const faqs = [
  {
    q: 'How quickly will I hear back?',
    a: 'We aim to respond to all enquiries within 24 hours on business days. For urgent enquiries, email us directly at lumashift@outlook.com.',
  },
  {
    q: 'Do you work with people outside Malaysia?',
    a: 'Yes. While we have deep knowledge of the Malaysian market, we also coach professionals in Singapore, the UK, Australia, and the Middle East.',
  },
  {
    q: 'What information should I include?',
    a: 'The more context you give us, the better. Tell us your current role/background, what you\'re trying to achieve, and your timeline. This helps us give you a useful first response.',
  },
  {
    q: 'Do I need to book a call?',
    a: 'No — everything starts with an email. We\'ll assess your situation and recommend the right next step, whether that\'s a quick 30-min consultation or a full coaching package.',
  },
  {
    q: 'Do you offer group/corporate packages?',
    a: 'Yes. We run workshops for university cybersecurity clubs, bootcamps, and corporate L&D teams. Contact us with your requirements.',
  },
];

export default function ContactPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-20 bg-muted border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">Get in Touch</span>
          <h1 className="section-title mt-4">
            Let&apos;s Talk About Your Career
          </h1>
          <p className="section-subtitle mt-4 mx-auto">
            No pressure. No sales pitch. Just an honest conversation about where you are and how we can help.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form — wider */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Send Us a Message
            </h2>
            <p className="text-muted-foreground mb-8">
              Tell us your situation. The more context, the better our first response will be.
            </p>
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact info */}
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4">Contact Details</h3>
              <div className="space-y-4">
                <a
                  href="mailto:lumashift@outlook.com"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <Mail size={18} className="text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                      lumashift@outlook.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <Clock size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Response Time</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <Shield size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Sessions via</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Google Meet or Zoom</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <MessageSquare size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Coverage</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Malaysia + Global</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* What to expect */}
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-3">What Happens Next</h3>
              <ol className="space-y-3">
                {[
                  { step: '1', text: 'You send us a message with your background and goals.' },
                  { step: '2', text: 'We review and reply within 24 hours with an honest assessment.' },
                  { step: '3', text: 'We recommend the right service or next step for your situation.' },
                  { step: '4', text: 'You decide if and how you want to proceed — no pressure.' },
                ].map((item) => (
                  <li key={item.step} className="flex gap-3">
                    <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <Card key={faq.q} className="p-6">
                <h4 className="font-bold text-foreground mb-2 text-sm">{faq.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
