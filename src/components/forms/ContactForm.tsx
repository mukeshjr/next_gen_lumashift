'use client';

import { useState, FormEvent } from 'react';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ContactFormProps {
  serviceId?: string;
  title?: string;
}

export function ContactForm({ serviceId, title }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          formType: 'contact',
          service: serviceId ?? '',
          source: title ?? 'Contact Page',
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? 'Unknown error');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please email lumashift@outlook.com directly.'
      );
    }
  };

  if (status === 'success') {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Message Received!
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We&apos;ll get back to you within 24 hours. Check your inbox — we might have a few questions.
          </p>
          <Button
            onClick={() => setStatus('idle')}
            variant="brandOutline"
            size="brand-default"
            className="mt-6"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label" htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Amirah Zulkifli"
            value={form.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="phone">Phone / WhatsApp (optional)</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+60 12 345 6789"
          value={form.phone}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div>
        <label className="form-label" htmlFor="message">Your Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={`Tell us about your situation — current role, experience level, what you're looking to achieve, and any specific questions. The more context you share, the better we can help.`}
          value={form.message}
          onChange={handleChange}
          className="form-input resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        variant="brand"
        size="brand-default"
        className="w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader size={16} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send size={16} /> Send Message
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-400">
        We typically respond within 24 hours. Or email us directly at{' '}
        <a href="mailto:lumashift@outlook.com" className="text-orange-500 hover:underline">
          lumashift@outlook.com
        </a>
      </p>
    </form>
  );
}
