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
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#0a0e1a] border-b border-white/10 py-3'  // CHANGED: Solid color instead of transparent
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

          {/* Mobile — compact dot WITH TOOLTIP */}
          <div className="sm:hidden relative group">
            <span
              aria-label="Available for projects"
              className="block w-2.5 h-2.5 rounded-full bg-[#3ecfb3] cursor-help"
              style={{ boxShadow: '0 0 8px rgba(62,207,179,0.7)' }}
            />
            {/* Tooltip - positioned to the right */}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
              <div className="bg-black/90 backdrop-blur-md text-white text-xs py-1.5 px-3 rounded-lg border border-white/20 shadow-lg">
                Available for Projects
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-black/90 border-l border-t border-white/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Centre — logo + nav links */}
        {/* MOBILE LOGO */}
        <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="font-mono font-bold text-base tracking-tight text-white hover:text-[#7c6af7] transition-colors whitespace-nowrap"
            aria-label="SecureGarv — go to home"
          >
            <span className="text-[#7c6af7]">.</span>SecureGarv
          </a>
        </div>

        {/* Desktop logo + nav (hidden on mobile) */}
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

      {/* Inline keyframe for pulse dot */}
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