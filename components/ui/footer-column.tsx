import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Twitch,
  Mail,
  MapPin,
  Phone,
  Shield,
  Map,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

/* Branded SVG icons not available in lucide-react */
function FlickrIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="7" cy="12" r="5" />
      <circle cx="17" cy="12" r="5" opacity="0.6" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.8 11.33c.02.16.03.33.03.5 0 2.55-2.97 4.63-6.63 4.63s-6.63-2.07-6.63-4.63c0-.17.01-.33.03-.5A1.75 1.75 0 0 1 4.5 12c0-.57.27-1.08.7-1.4a5.44 5.44 0 0 1 3.17-3.3.75.75 0 0 1 .86.18l1.34 1.5c.44-.08.91-.13 1.43-.13s.99.05 1.43.13l1.34-1.5a.75.75 0 0 1 .86-.18 5.44 5.44 0 0 1 3.17 3.3c.43.32.7.83.7 1.4a1.75 1.75 0 0 1-.7 1.33zM9.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-4.73 2.07a.5.5 0 0 0-.04.71c.85.93 2.12 1.47 3.27 1.47s2.42-.54 3.27-1.47a.5.5 0 1 0-.75-.67c-.64.7-1.6 1.14-2.52 1.14s-1.88-.44-2.52-1.14a.5.5 0 0 0-.71-.04z" />
    </svg>
  );
}

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/GrowMinistryInfo' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/growministryinfo/' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/grow-ministry/' },
  { icon: Twitter, label: 'X / Twitter', href: 'https://x.com/grow_ministry?s=21&t=th9tat1JPOeOeXiTvgrsxw' },
  { icon: FlickrIcon, label: 'Flickr', href: 'https://www.flickr.com/photos/201069901@N07' },
  { icon: RedditIcon, label: 'Reddit', href: 'https://www.reddit.com/user/GrowMinistry/' },
  { icon: Twitch, label: 'Twitch', href: 'https://www.twitch.tv/growministry' },
];

const serviceLinks = [
  { text: 'AI Telephone Agent', href: '/services#ai-telephone' },
  { text: 'CRM Solutions', href: '/services#crm' },
  { text: 'Social Media', href: '/services#social-media' },
  { text: 'Website & SEO', href: '/services#website-seo' },
  { text: 'Faith-Based Travel', href: '/travel' },
  { text: 'Branded Merchandise', href: 'https://growministry.com/shop/', external: true },
];

const aboutLinks = [
  { text: 'About Us', href: '/about' },
  { text: 'FAQ', href: '/faq' },
  { text: 'Press', href: 'https://growministry.com/blog/', external: true },
  { text: 'Contact', href: '/contact' },
  { text: 'Internships', href: 'https://my.usaev.net/v2/preview/HdNRJ2eV8bSk1sndSQup', external: true },
  { text: 'Skillbridge', href: 'https://my.usaev.net/v2/preview/vZvbFocFnB7w23DyleMB', external: true },
];

const legalLinks = [
  { text: 'Privacy Policy', href: '/privacy-policy' },
  { text: 'Terms of Service', href: '/terms' },
  { text: 'Cookie Policy', href: '/cookie-policy' },
  { text: 'Copyright Policy', href: '/copyright-policy' },
];

const contactInfo = [
  { icon: Mail, text: 'info@growministry.com', href: 'mailto:info@growministry.com' },
  { icon: Phone, text: '970-426-0844', href: 'tel:9704260844' },
  { icon: MapPin, text: 'Severance, CO, United States', href: '#', isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16 w-full">
      <div className="mx-auto max-w-screen-xl px-4 pt-12 pb-6 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand + Certification Column */}
          <div>
            <div className="flex justify-center gap-3 sm:justify-start items-center">
              <div className="size-16 rounded-full overflow-hidden shrink-0">
                <Image
                  src="/images/grow-ministry-logo.webp"
                  alt="Grow Ministry Logo"
                  width={90}
                  height={90}
                  className="w-full h-full object-cover scale-[1.45]"
                />
              </div>
              <span className="text-2xl font-semibold">
                Grow Ministry
              </span>
            </div>

            <p className="text-primary-foreground/60 mt-4 max-w-md text-center leading-relaxed text-sm sm:max-w-xs sm:text-left">
              AI-Powered Digital Growth for Faith-Based Organizations.
            </p>

            {/* Social Links */}
            <ul className="mt-6 flex flex-wrap justify-center gap-4 sm:justify-start">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/50 hover:text-accent hover:scale-125 transition-all duration-200 inline-block"
                    title={label}
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-5" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* SDVOSB Certification Block */}
            <div className="mt-6 flex flex-col items-center sm:items-start gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/sdvosb-certified.webp"
                  alt="Service-Disabled Veteran-Owned Small Business Certified"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div className="text-xs leading-tight text-primary-foreground/60">
                  <p className="font-semibold text-primary-foreground/80">SDVOSB Certified</p>
                  <p>Service-Disabled Veteran-Owned</p>
                  <p>Small Business</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-foreground/50">
                <Shield className="size-4" />
                <span>CAGE Code: 9W3P6 &bull; UEI: H5BQG2J7JRB4</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Services</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href, external }) => (
                  <li key={text}>
                    {external ? (
                      <a
                        className="text-primary-foreground/60 hover:text-accent transition"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {text}
                      </a>
                    ) : (
                      <Link
                        className="text-primary-foreground/60 hover:text-accent transition"
                        href={href}
                      >
                        {text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Company</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href, external }) => (
                  <li key={text}>
                    {external ? (
                      <a
                        className="text-primary-foreground/60 hover:text-accent transition"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {text}
                      </a>
                    ) : (
                      <Link
                        className="text-primary-foreground/60 hover:text-accent transition"
                        href={href}
                      >
                        {text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Legal</p>
              <ul className="mt-8 space-y-4 text-sm">
                {legalLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-primary-foreground/60 hover:text-accent transition"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-2 sm:justify-start text-primary-foreground/60 hover:text-accent transition"
                      href={href}
                    >
                      <Icon className="size-5 shrink-0" />
                      {isAddress ? (
                        <address className="-mt-0.5 flex-1 not-italic">
                          {text}
                        </address>
                      ) : (
                        <span className="flex-1">{text}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/10 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-primary-foreground/40 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Grow Ministry. All rights reserved.
              <span className="block sm:inline sm:ml-1 text-primary-foreground/30">
                A Dakdan Worldwide Company
              </span>
            </p>

            <Link
              href="/sitemap"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-primary-foreground/40 hover:text-accent transition"
            >
              <Map className="size-3.5" />
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
