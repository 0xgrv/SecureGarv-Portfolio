import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Linkedin, LibraryBig } from 'lucide-react';
import MobileNav from "./MobileNav";

const MainNav = () => {
  const [showAvailability, setShowAvailability] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleAvailability = () => {
    setShowAvailability(!showAvailability);
    // Hide the message after 3 seconds
    if (!showAvailability) {
      setTimeout(() => setShowAvailability(false), 3000);
    }
  };
  
  // Smooth scroll handler for anchor links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <header className={`fixed top-2 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <nav className="container mx-auto px-4 flex justify-between items-center">
        {/* Left Section - Availability Status */}
        <div className="flex items-center">
          <div className="hidden sm:flex glass px-4 py-2 sm:px-6 sm:py-3 rounded-full items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm sm:text-base">Available for Projects</span>
          </div>
          
          {/* Mobile Version - Just the dot */}
          <div className="sm:hidden">
            <button 
              onClick={toggleAvailability}
              className="relative flex items-center justify-center"
              aria-label="Availability status"
            >
              <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
              {showAvailability && (
                <div className="absolute top-full left-0 mt-2 glass px-4 py-2 rounded-lg whitespace-nowrap z-50">
                  Available for Projects
                </div>
              )}
            </button>
          </div>
        </div>
        
        {/* Middle Section - Logo and Navigation Links in one row */}
        <div className="glass px-6 py-3 rounded-full hidden lg:flex items-center gap-8">
          {/* Logo */}
          <a href="#home" className="text-lg font-bold" onClick={(e) => scrollToSection(e, 'home')}>.SecureGarv</a>
          
          {/* Navigation Links - All in one row */}
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-primary transition-colors" onClick={(e) => scrollToSection(e, 'home')}>
              Home
            </a>
            <a href="#about" className="hover:text-primary transition-colors" onClick={(e) => scrollToSection(e, 'about')}>
              About
            </a>
            <a href="#education" className="hover:text-primary transition-colors" onClick={(e) => scrollToSection(e, 'education')}>
              Education
            </a>
            <a href="#projects" className="hover:text-primary transition-colors" onClick={(e) => scrollToSection(e, 'projects')}>
              Projects
            </a>
            <a href="#experience" className="hover:text-primary transition-colors" onClick={(e) => scrollToSection(e, 'experience')}>
              Experience
            </a>
            <a href="#blog" className="hover:text-primary transition-colors" onClick={(e) => scrollToSection(e, 'blog')}>
              Blogs
            </a>
            <a href="#testimonials" className="hover:text-primary transition-colors" onClick={(e) => scrollToSection(e, 'testimonials')}>
              Testimonials
            </a>
            <a href="#contact" className="hover:text-primary transition-colors" onClick={(e) => scrollToSection(e, 'contact')}>
              Contact
            </a>
          </div>
        </div>
        
        {/* Right Section - Social Icons and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Social Icons - Desktop */}
          <div className="glass px-4 py-2 sm:px-6 sm:py-3 rounded-full items-center gap-4 hidden sm:flex">
            <a href="https://github.com/0xgrv/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/garvkamra/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://www.amazon.in/stores/Garv-Kamra/author/B0FJWL3F7D/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <LibraryBig className="w-5 h-5" />
            </a>
            <a href="mailto:garvkamra24@gmail.com" className="hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          
          {/* Mobile Menu Button - Moved to the left of social icons container */}
          <div className="lg:hidden ml-auto">
            <MobileNav scrollToSection={scrollToSection} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainNav;