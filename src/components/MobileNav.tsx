import { useState } from 'react';
import { Menu, X, Github, Mail, Linkedin, LibraryBig } from 'lucide-react';

interface MobileNavProps {
  scrollToSection: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'community', label: 'Community' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

const SOCIAL_LINKS = [
  { href: 'https://github.com/0xgrv/', label: 'GitHub', icon: Github, external: true },
  { href: 'https://www.linkedin.com/in/garvkamra/', label: 'LinkedIn', icon: Linkedin, external: true },
  { href: 'https://www.amazon.in/stores/Garv-Kamra/author/B0FJWL3F7D/', label: 'Books', icon: LibraryBig, external: true },
  { href: 'mailto:securegarv@gmail.com', label: 'Email', icon: Mail, external: false },
];

const MobileNav = ({ scrollToSection }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass p-2.5 rounded-xl transition-colors hover:bg-white/10"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Simple Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 z-50 bg-[rgba(8,12,20,0.98)] border-l border-white/10 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <span className="font-mono font-bold">
                <span className="text-[#7c6af7]">.</span>SecureGarv
              </span>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 p-6">
              {NAV_LINKS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className="block px-4 py-3 rounded-xl text-[#687081] hover:text-white hover:bg-white/5"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="p-6 border-t border-white/10">
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-[#687081] hover:text-white"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNav;