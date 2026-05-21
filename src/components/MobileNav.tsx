import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Github, Mail, Linkedin, LibraryBig } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  scrollToSection: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const NAV_LINKS = [
  { id: 'home',       label: 'Home' },
  { id: 'about',      label: 'About' },
  { id: 'education',  label: 'Education' },
  { id: 'projects',   label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'community',  label: 'Community' },
  { id: 'blog',       label: 'Blog' },
  { id: 'contact',    label: 'Contact' },
] as const;

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/0xgrv/',
    label: 'GitHub',
    icon: Github,
    external: true,
  },
  {
    href: 'https://www.linkedin.com/in/garvkamra/',
    label: 'LinkedIn',
    icon: Linkedin,
    external: true,
  },
  {
    href: 'https://www.amazon.in/stores/Garv-Kamra/author/B0FJWL3F7D/',
    label: 'Books',
    icon: LibraryBig,
    external: true,
  },
  {
    href: 'mailto:securegarv@gmail.com',
    label: 'Email',
    icon: Mail,
    external: false,
  },
] as const;

const MobileNav = ({ scrollToSection }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isOpen &&
        !target.closest('.mobile-sidebar') &&
        !target.closest('.mobile-menu-btn')
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    close();
    scrollToSection(e, id);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="mobile-menu-btn glass p-2.5 rounded-xl transition-colors hover:bg-white/10"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
      >
        {isOpen
          ? <X className="w-5 h-5" aria-hidden="true" />
          : <Menu className="w-5 h-5" aria-hidden="true" />
        }
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="panel"
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="mobile-sidebar fixed inset-y-0 right-0 w-72 z-50 flex flex-col"
            style={{
              background: 'rgba(8,12,20,0.97)',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <span className="font-mono font-bold text-base">
                <span className="text-[#7c6af7]">.</span>SecureGarv
              </span>
              <button
                onClick={close}
                aria-label="Close menu"
                className="p-1.5 rounded-lg hover:bg-white/8 transition-colors text-[#687081] hover:text-white"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Nav links */}
            <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-6">
              <ul className="space-y-1" role="list">
                {NAV_LINKS.map(({ id, label }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.1 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={(e) => handleNavClick(e, id)}
                      className={cn(
                        'block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                        'text-[#687081] hover:text-white hover:bg-white/5',
                      )}
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Social icons */}
            <div className="p-6 border-t border-white/5">
              <p className="text-xs font-mono text-[#3d4452] uppercase tracking-widest mb-3">
                Connect
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="w-9 h-9 rounded-lg border border-white/8 flex items-center justify-center text-[#687081] hover:text-white hover:border-white/20 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;