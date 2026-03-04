import Link from 'next/link';
import { Shield, Mail, Linkedin, ArrowRight } from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'Resume Review', href: '/services#resume-review' },
    { label: 'LinkedIn Optimisation', href: '/services#linkedin-optimisation' },
    { label: 'Mock Interviews', href: '/services#mock-interview-technical' },
    { label: 'Career Packages', href: '/services#job-ready-package' },
    { label: 'GRC Track', href: '/services#grc-coaching-track' },
    { label: 'Cloud Security Track', href: '/services#cloud-security-track' },
  ],
  'Career Guides': [
    { label: 'Security Analyst', href: '/career/security-analyst' },
    { label: 'SOC Analyst', href: '/career/soc-analyst' },
    { label: 'GRC Analyst', href: '/career/grc-analyst' },
    { label: 'Cloud Security', href: '/career/cloud-security' },
    { label: 'OT/ICS Security', href: '/career/ot-ics-security' },
  ],
  Tools: [
    { label: 'Career Quiz', href: '/quiz' },
    { label: 'Compare Roles', href: '/compare-roles' },
    { label: 'Blog', href: '/blog' },
    { label: 'Free Resources', href: '/resources' },
  ],
  Company: [
    { label: 'Meet the Team', href: '/team' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-300">
      {/* CTA Strip */}
      <div className="bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xl font-bold text-white">Ready to accelerate your cybersecurity career?</p>
            <p className="text-orange-100 mt-1">Get expert coaching tailored to Malaysia and the global market.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg whitespace-nowrap"
          >
            Contact Us Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Luma<span className="text-orange-500">Shift</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Cybersecurity career coaching for Malaysian and global professionals. From first job to senior role.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:lumashift@outlook.com"
                className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/lumashift"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LumaShift. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Cybersecurity career coaching for Malaysia and beyond.{' '}
            <a href="mailto:lumashift@outlook.com" className="text-orange-500 hover:text-orange-400">
              lumashift@outlook.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
