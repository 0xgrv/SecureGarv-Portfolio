import { useState, useEffect } from 'react';
import { Github, Mail, Linkedin, LibraryBig } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import MobileNav from './MobileNav';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'community', label: 'Community' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
] as const;

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-[rgba(8,12,20,0.9)] backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <nav
        aria-label="Primary navigation"
        className="container mx-auto px-4 flex items-center justify-between"
      >
        {/* Left — availability badge */}
        <div className="flex items-center">
          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(62,207,179,0.2)] bg-[rgba(62,207,179,0.04)] text-sm font-mono text-[#3ecfb3]">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#3ecfb3] inline-block"
              style={{
                animation: 'pulse-ring-sm 2s ease-in-out infinite',
                boxShadow: '0 0 6px rgba(62,207,179,0.6)',
              }}
            />
            Open to Projects
          </div>

          {/* Mobile — compact dot */}
          <div className="sm:hidden">
            <span
              aria-label="Available for projects"
              className="block w-2.5 h-2.5 rounded-full bg-[#3ecfb3]"
              style={{ boxShadow: '0 0 8px rgba(62,207,179,0.7)' }}
            />
          </div>
        </div>

        {/* Centre — logo + nav links */}
        <div className="hidden lg:flex items-center gap-8 px-7 py-3 rounded-full glass">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="font-mono font-bold text-base tracking-tight text-white hover:text-[#7c6af7] transition-colors"
            aria-label="SecureGarv — go to home"
          >
            <span className="text-[#7c6af7]">.</span>SecureGarv
          </a>

          <div className="flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                role="listitem"
                onClick={(e) => scrollToSection(e, id)}
                className={`relative px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${activeId === id
                    ? 'text-white font-medium'
                    : 'text-[#687081] hover:text-white'
                  }`}
                aria-current={activeId === id ? 'page' : undefined}
              >
                {label}
                {activeId === id && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-[#7c6af7] rounded-full" />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Right — socials + mobile menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 rounded-full glass">
            <a
              href="https://github.com/0xgrv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-[#687081] hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/garvkamra/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-[#687081] hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.amazon.in/stores/Garv-Kamra/author/B0FJWL3F7D/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Amazon author page"
              className="text-[#687081] hover:text-white transition-colors"
            >
              <LibraryBig className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:securegarv@gmail.com"
              aria-label="Send email"
              className="text-[#687081] hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="lg:hidden">
            <MobileNav scrollToSection={scrollToSection} />
          </div>
        </div>
      </nav>

      {/* Inline keyframe for pulse dot — avoids adding to global CSS */}
      <style>{`
        @keyframes pulse-ring-sm {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </header>
  );
};

export default MainNav;