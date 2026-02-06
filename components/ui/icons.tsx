/**
 * Custom SVG icons not available in lucide-react.
 * Shared across home page and footer.
 */

export function FlickrIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="7" cy="12" r="5" />
      <circle cx="17" cy="12" r="5" opacity="0.6" />
    </svg>
  );
}

export function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.8 11.33c.02.16.03.33.03.5 0 2.55-2.97 4.63-6.63 4.63s-6.63-2.07-6.63-4.63c0-.17.01-.33.03-.5A1.75 1.75 0 0 1 4.5 12c0-.57.27-1.08.7-1.4a5.44 5.44 0 0 1 3.17-3.3.75.75 0 0 1 .86.18l1.34 1.5c.44-.08.91-.13 1.43-.13s.99.05 1.43.13l1.34-1.5a.75.75 0 0 1 .86-.18 5.44 5.44 0 0 1 3.17 3.3c.43.32.7.83.7 1.4a1.75 1.75 0 0 1-.7 1.33zM9.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-4.73 2.07a.5.5 0 0 0-.04.71c.85.93 2.12 1.47 3.27 1.47s2.42-.54 3.27-1.47a.5.5 0 1 0-.75-.67c-.64.7-1.6 1.14-2.52 1.14s-1.88-.44-2.52-1.14a.5.5 0 0 0-.71-.04z" />
    </svg>
  );
}
