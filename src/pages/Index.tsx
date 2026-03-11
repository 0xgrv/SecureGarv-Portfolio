import { useRef, useState, useEffect, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Shield, Code, GraduationCap, User, Brain, Rocket, Briefcase, Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import BlogCard from "../components/BlogCard";
import BlogModal from "../components/BlogModal";
import MainNav from "../components/MainNav";
import MarqueeSkills from "../components/MarqueeSkills";
import ProjectCard from "../components/ProjectCard";
import ExperienceCard from "../components/ExperienceCard";
import EducationCard from "../components/EducationCard";
import FilterButton from "../components/FilterButton";
import FeedbackSection from "../components/FeedbackSection";

// API configuration - Update with your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Types for our content structure
 */
interface HeroContent {
  typewriterTexts: string[];
  heroParagraph: string;
  resume: {
    url: string;
    fileName: string;
  };
  about?: {
    whoIAm: string;
    myExpertise: string;
    myMission: string;
    myJourney: string;
  };
}

interface EducationItem {
  id: string;
  type: 'education' | 'certification' | 'achievement' | 'publication';
  institution: string;
  degree: string;
  period: string;
  description: string;
  certificateLink?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
  category: string;
}

interface Experience {
  _id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
  isCurrentJob: boolean;
}

interface Skill {
  _id: string;
  name: string;
  category: string;
  iconUrl?: string;
  proficiency: number;
  featured?: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

interface Review {
  _id: string;
  name: string;
  position: string;
  company?: string;
  rating: number;
  text: string;
  projectType: string;
  isActive: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  websiteUrl?: string;
}



const Index = () => {

  const location = useLocation();
  const blogSectionRef = useRef<HTMLDivElement>(null);

  // Refs for mouse effects
  const observerRef = useRef<IntersectionObserver | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Mouse effects state
  const [mouseActive, setMouseActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Education filter state
  const [activeFilter, setActiveFilter] = useState<'all' | 'education' | 'certification' | 'achievement' | 'publication'>('all');

  // Contact form state
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '', // Add subject field
    message: ''
  });

  // Data states
  const [heroContent, setHeroContent] = useState<HeroContent>({
    typewriterTexts: [],
    heroParagraph: '',
    resume: { url: '', fileName: '' }
  });

  
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Blog modal state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  // ========================
  // DATA FETCHING
  // ========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [contentRes, educationRes, projectsRes, experienceRes, skillsRes, blogRes, reviewsRes] = await Promise.all([
          fetch(`${API_URL}/api/content`),
          fetch(`${API_URL}/api/education`),
          fetch(`${API_URL}/api/projects`),
          fetch(`${API_URL}/api/experience`),
          fetch(`${API_URL}/api/skills`),
          fetch(`${API_URL}/api/blog`),
          fetch(`${API_URL}/api/reviews`)
        ]);

        // Check if all responses are OK
        if (!contentRes.ok) throw new Error('Failed to fetch content');
        if (!educationRes.ok) throw new Error('Failed to fetch education');
        if (!projectsRes.ok) throw new Error('Failed to fetch projects');
        if (!experienceRes.ok) throw new Error('Failed to fetch experience');
        if (!skillsRes.ok) throw new Error('Failed to fetch skills');
        if (!blogRes.ok) throw new Error('Failed to fetch blog posts');
        if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');

        // Parse all responses
        const [content, education, projects, experience, skills, blogData, reviewsData] = await Promise.all([
          contentRes.json(),
          educationRes.json(),
          projectsRes.json(),
          experienceRes.json(),
          skillsRes.json(),
          blogRes.json(),
          reviewsRes.json()
        ]);

        // Set data from API
        setHeroContent(content);
        setEducation(education);
        setProjects(projects);
        setExperiences(experience);
        setSkills(skills);
        setReviews(reviewsData.reviews || []);
        
        // Handle blog data format (could be array or object with posts property)
        if (Array.isArray(blogData)) {
          setBlogPosts(blogData);
        } else if (blogData && Array.isArray(blogData.posts)) {
          setBlogPosts(blogData.posts);
        } else {
          console.warn('Unexpected blog data format:', blogData);
          setBlogPosts([]);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please check your connection and try again.');
        
        // Set empty states instead of dummy data
        setHeroContent({
          typewriterTexts: [],
          heroParagraph: '',
          resume: { url: '', fileName: '' },
          about: {
            whoIAm: '',
            myExpertise: '',
            myMission: '',
            myJourney: ''
          }
        });
        setEducation([]);
        setProjects([]);
        setExperiences([]);
        setSkills([]);
        setBlogPosts([]);
        setReviews([]);
        
      } finally {
        setLoading(false);
      }
        
    };
    fetchData();
  }, []);

  // ========================
  // SCROLL TO BLOG SECTION
  // ========================
  useEffect(() => {
    if (location.state?.scrollToBlog && blogSectionRef.current) {
      blogSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      // Clear the state to prevent scrolling on every render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Generate typewriter animation sequence
  const typeAnimationSequence = useMemo(() => {
    return heroContent.typewriterTexts.flatMap(text => [text, 2000]);
  }, [heroContent.typewriterTexts]);

  // Count education items by type
  const counts = {
    all: education.length,
    education: education.filter(item => item.type === 'education').length,
    certification: education.filter(item => item.type === 'certification').length,
    achievement: education.filter(item => item.type === 'achievement').length,
    publication: education.filter(item => item.type === 'publication').length
  };

  // Filter education items
  const filteredEducation = activeFilter === 'all' 
    ? education 
    : education.filter(item => item.type === activeFilter);

   // ========================
  // MOUSE EFFECTS
  // ========================
  useEffect(() => {
    const gridContainer = gridRef.current;
    const glowElement = glowRef.current;
    
    if (!gridContainer || !glowElement) return;
    
    const createGridPoints = () => {
      const gridPointsContainer = document.createElement('div');
      gridPointsContainer.className = 'grid-points';
      gridContainer.appendChild(gridPointsContainer);
      
      const containerWidth = gridContainer.offsetWidth;
      const containerHeight = gridContainer.offsetHeight;
      
      const cols = Math.floor(containerWidth / 40);
      const rows = Math.floor(containerHeight / 40);
      
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const point = document.createElement('div');
          point.className = 'grid-point';
          point.style.left = `${i * 40}px`;
          point.style.top = `${j * 40}px`;
          point.style.opacity = (Math.random() * 0.5 + 0.1).toString();
          gridPointsContainer.appendChild(point);
        }
      }
    };
    
    createGridPoints();
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridContainer || !glowElement) return;
      
      const rect = gridContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePosition({ x, y });
      
      glowElement.style.left = `${x}px`;
      glowElement.style.top = `${y}px`;
      glowElement.style.opacity = '1';
      glowElement.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
      
      const points = document.querySelectorAll('.grid-point');
      points.forEach((point) => {
        const pointRect = (point as HTMLElement).getBoundingClientRect();
        const pointX = pointRect.left - rect.left + pointRect.width / 2;
        const pointY = pointRect.top - rect.top + pointRect.height / 2;
        
        const distance = Math.sqrt(Math.pow(pointX - x, 2) + Math.pow(pointY - y, 2));
        const maxDistance = 200;
        
        if (distance < maxDistance) {
          const intensity = 1 - (distance / maxDistance);
          (point as HTMLElement).style.opacity = Math.min(0.1 + intensity * 0.9, 1).toString();
          (point as HTMLElement).style.transform = `scale(${1 + intensity * 0.6})`;
          (point as HTMLElement).style.filter = `blur(${Math.max(0, 0.5 - intensity)}px)`;
        } else {
          (point as HTMLElement).style.opacity = "0.1";
          (point as HTMLElement).style.transform = "scale(1)";
          (point as HTMLElement).style.filter = "blur(0.5px)";
        }
      });
      
      setMouseActive(true);
    };
    
    const handleMouseLeave = () => {
      if (!glowElement) return;
      glowElement.style.opacity = '0';
      
      const points = document.querySelectorAll('.grid-point');
      points.forEach((point) => {
        (point as HTMLElement).style.opacity = (Math.random() * 0.2 + 0.1).toString();
        (point as HTMLElement).style.transform = "scale(1)";
        (point as HTMLElement).style.filter = "blur(0.5px)";
      });
      
      setMouseActive(false);
    };
    
    gridContainer.addEventListener('mousemove', handleMouseMove);
    gridContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      gridContainer.removeEventListener('mousemove', handleMouseMove);
      gridContainer.addEventListener('mouseleave', handleMouseLeave);
      
      const gridPointsContainer = gridContainer.querySelector('.grid-points');
      if (gridPointsContainer) {
        gridContainer.removeChild(gridPointsContainer);
      }
    };
  }, []);

  // ========================
  // CONTACT FORM HANDLER
  // ========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - now includes subject
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    // Name validation
    if (formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    // Subject validation
    if (formData.subject.trim().length < 5) {
      toast.error('Subject must be at least 5 characters');
      return;
    }

    // Rest of your validation remains the same...
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Block disposable/temporary emails
    const tempEmailDomains = [
      'tempmail.com', 'mailinator.com', 'guerrillamail.com', 
      '10minutemail.com', 'throwawaymail.com', 'fakeinbox.com',
      'yopmail.com', 'trashmail.com', 'maildrop.cc'
    ];
    const emailDomain = formData.email.split('@')[1];
    if (tempEmailDomains.some(domain => emailDomain.includes(domain))) {
      toast.error('Please use a permanent email address');
      return;
    }

    // Message validation
    if (formData.message.trim().length < 10) {
      toast.error('Message should be at least 10 characters');
      return;
    }

    setIsSending(true);

    try {
      // Send to Web3Forms first
      const web3formData = new FormData();
      web3formData.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY);
      web3formData.append('name', formData.name);
      web3formData.append('email', formData.email);
      web3formData.append('subject', formData.subject); // Include subject
      web3formData.append('message', formData.message);
      web3formData.append('botcheck', '');

      const web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3formData
      });

      const web3Data = await web3Response.json();

      if (!web3Response.ok || !web3Data.success) {
        throw new Error(web3Data.message || 'Web3Forms submission failed');
      }

      // If Web3Forms succeeds, send to our backend
      const backendResponse = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_PUBLIC_API_KEY  // 👈 add public key
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          isRead: false,
          isStarred: false,
          isArchived: false
        })
      });


      const backendData = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(backendData.error || 'Backend submission failed');
      }

      // Success - clear form and show success message
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset subject too
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Network error - please check your connection');
      } else {
        toast.error(error.message || 'An error occurred. Please try again.');
      }
      
    } finally {
      setIsSending(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Basic input sanitization
    let sanitizedValue = value;
    if (name === 'name') {
      // Remove any numbers from name field
      sanitizedValue = value.replace(/[0-9]/g, '');
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: sanitizedValue 
    }));
  };
  // ========================
  // HELPER FUNCTIONS
  // ========================
  const getIcon = (type: 'education' | 'certification' | 'achievement' | 'publication') => {
    switch (type) {
      case 'education': return <GraduationCap className="w-6 h-6 text-white" />;
      case 'certification': return <Code className="w-6 h-6 text-white" />;
      case 'achievement': return <Shield className="w-6 h-6 text-white" />;
      case 'publication': return <ArrowRight className="w-6 h-6 text-white" />;
      default: return <GraduationCap className="w-6 h-6 text-white" />;
    }
  };

  const getIconBgClass = (type: 'education' | 'certification' | 'achievement' | 'publication') => {
    switch (type) {
      case 'education': return 'bg-purple-500';
      case 'certification': return 'bg-blue-500';
      case 'achievement': return 'bg-amber-500';
      case 'publication': return 'bg-emerald-500';
      default: return 'bg-primary';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error toast if there was an error
  if (error) {
    toast.error(error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <MainNav />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32">
        <div ref={gridRef} className="absolute inset-0 grid-background">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-[200%] h-[200%] -left-[50%] -top-[50%] bg-primary/10 blur-[200px] opacity-70 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[150px] animate-pulse-slow"></div>
            <div className="absolute top-1/4 left-20 w-[500px] h-[500px] bg-[#6E59A5]/30 rounded-full blur-[180px] animate-pulse-slow"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background z-10"></div>
          <div 
            ref={glowRef} 
            className="grid-glow absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(155,135,245,0.3) 0%, rgba(155,135,245,0.1) 40%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.5s ease, transform 0.3s ease',
              opacity: mouseActive ? 1 : 0
            }}
          />
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: mouseActive 
                ? `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(155,135,245,0.15), transparent 70%)`
                : 'transparent',
              transition: 'background 0.3s ease'
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          {/* Mobile Avatar */}
          <div className="lg:hidden flex flex-col items-center animate-fade-in mb-12">
            <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full overflow-hidden relative glass p-1 glow-border">
              <img
                src="/hero.png"
                alt="Garv Kamra"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                <span className="text-gradient-primary">Hello</span>,{" "}
                <TypeAnimation
                  sequence={typeAnimationSequence}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                {heroContent.heroParagraph}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href={heroContent.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover-glow flex items-center justify-center gap-2 group"
                >
                  Download Resume
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3 glass rounded-lg hover:bg-white/20 transition-colors"
                >
                  Get in touch
                </a>
              </div>
            </div>
            
            {/* Desktop Avatar */}
            <div className="hidden lg:flex flex-col items-center animate-fade-in">
              <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full overflow-hidden relative glass p-1 glow-border">
                <img
                  src="/hero.png"
                  alt="Garv Kamra"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-xl">
                <div className="glass p-4 rounded-lg text-center hover-glow-subtle">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Cybersecurity</h3>
                  <p className="text-xs text-muted-foreground">SOC L1 Aspirant | CEH v12, CND v3</p>
                </div>
                <div className="glass p-4 rounded-lg text-center hover-glow-subtle">
                  <Code className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Development</h3>
                  <p className="text-xs text-muted-foreground">React, Tailwind, Express.js</p>
                </div>
                <div className="glass p-4 rounded-lg text-center hover-glow-subtle">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Hardware & IoT</h3>
                  <p className="text-xs text-muted-foreground">Arduino, NodeMCU, Robotics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              About <span className="text-gradient-primary">Me</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get to know me, my skills, and what drives my passion for cybersecurity and development.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              className="glass p-8 rounded-2xl transform hover:scale-105 transition-all duration-300" 
              style={{ 
                transform: "perspective(1000px) rotateX(0deg)",
                transition: "transform 0.5s ease",
                willChange: "transform"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 20;
                const rotateY = (x - rect.width / 2) / 20;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Who I Am</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {heroContent.about?.whoIAm}
              </p>
            </motion.div>

            <motion.div 
              className="glass p-8 rounded-2xl transform hover:scale-105 transition-all duration-300"
              style={{ 
                transform: "perspective(1000px) rotateX(0deg)",
                transition: "transform 0.5s ease",
                willChange: "transform"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 20;
                const rotateY = (x - rect.width / 2) / 20;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">My Expertise</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {heroContent.about?.myExpertise}
              </p>
            </motion.div>

            <motion.div 
              className="glass p-8 rounded-2xl transform hover:scale-105 transition-all duration-300"
              style={{ 
                transform: "perspective(1000px) rotateX(0deg)",
                transition: "transform 0.5s ease",
                willChange: "transform"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 20;
                const rotateY = (x - rect.width / 2) / 20;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">My Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {heroContent.about?.myMission}
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="glass p-8 rounded-2xl max-w-4xl mx-auto mb-16 transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              transform: "perspective(1000px) rotateX(0deg)",
              transition: "transform 0.5s ease",
              willChange: "transform"
            }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const rotateX = (y - rect.height / 2) / 20;
              const rotateY = (x - rect.width / 2) / 20;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              My <span className="text-primary">From Curiosity to Cybersecurity</span>
            </h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {heroContent.about?.myJourney}
            </div>
          </motion.div>

{/* <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="mt-12 max-w-4xl mx-auto"
>
  <div className="glass p-6 rounded-xl">
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="md:w-1/2">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-xl font-bold">Cybersecurity Practice</h4>
        </div>
        <p className="text-muted-foreground mb-5 text-base leading-relaxed">
          Active on TryHackMe completing cybersecurity labs, CTF challenges, and skill development exercises.
        </p>
        <a 
          href="https://tryhackme.com/p/securegarv" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
        >
          View profile
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="md:w-1/2 flex justify-center mt-9">
        <iframe 
          src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=1986213" 
          style={{ 
            border: 'none', 
            width: '340px', 
            height: '160px',
            borderRadius: '8px'
          }}
          title="TryHackMe Badges"
          className="rounded-lg"
        />
      </div>
    </div>
  </div>
</motion.div> */}
          <div className="pt-12 mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                My <span className="text-primary">Skills</span>
              </motion.h2>
              <MarqueeSkills skills={skills} />
            </div>
            </div>
          </section>
      
      {/* Education Section */}
      <section id="education" className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Education & <span className="text-gradient-primary">Credentials</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A timeline of my educational background, professional certifications, achievements, and publications.
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <FilterButton 
              label="All" 
              count={counts.all}
              isActive={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')} 
            />
            <FilterButton 
              label="Education" 
              count={counts.education}
              isActive={activeFilter === 'education'} 
              onClick={() => setActiveFilter('education')} 
              colorClass="bg-purple-500/20"
            />
            <FilterButton 
              label="Certifications" 
              count={counts.certification}
              isActive={activeFilter === 'certification'} 
              onClick={() => setActiveFilter('certification')} 
              colorClass="bg-blue-500/20"
            />
            <FilterButton 
              label="Publications" 
              count={counts.publication}
              isActive={activeFilter === 'publication'} 
              onClick={() => setActiveFilter('publication')} 
              colorClass="bg-emerald-500/20"
            />
          </div>
          
          {filteredEducation.length === 0 ? (
            <div className="text-center py-12 glass rounded-lg">
              <p className="text-muted-foreground">No education items found for this filter.</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent"></div>
              
              <div className="space-y-8">
                {filteredEducation.map((edu, index) => (
                  <motion.div 
                    key={edu.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    id={edu.type}
                    className={`glass p-6 rounded-lg relative transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(155,135,245,0.3)] ml-10`}
                  >
                    <div className={`absolute -left-10 top-6 w-8 h-8 ${getIconBgClass(edu.type as 'education' | 'certification' | 'achievement' | 'publication')} rounded-full flex items-center justify-center`}>
                      {getIcon(edu.type as 'education' | 'certification' | 'achievement' | 'publication')}
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-xl font-bold">{edu.institution}</h3>
                        <span className="ml-3 text-xs uppercase bg-white/20 px-2 py-1 rounded-full">
                          {edu.type}
                        </span>
                      </div>
                      <p className="text-primary">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground mb-2">{edu.period}</p>
                      <p className="text-muted-foreground">
                        {edu.description}
                      </p>
                      {edu.certificateLink && (
                        <a 
                          href={edu.certificateLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 mt-3 text-primary hover:underline"
                        >
                          View <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              My <span className="text-gradient-primary">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A showcase of my work in web development and other technical projects.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard 
                  _id={project._id}
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  liveUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                  image={project.image}
                  category={project.category}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Experience Section */}
      <section id="experience" className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              My <span className="text-gradient-primary">Experience</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A chronological journey through my professional experiences and roles.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="glass px-6 py-3 rounded-full flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="font-medium">Professional Timeline</span>
                </div>
              </div>
              
              {experiences.length === 0 ? (
                <div className="text-center glass p-8 rounded-lg">
                  <p className="text-muted-foreground">No experience entries found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={exp._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ExperienceCard
                        _id={exp._id}
                        company={exp.company}
                        position={exp.position}
                        location={exp.location}
                        startDate={exp.startDate}
                        endDate={exp.endDate}
                        description={exp.description}
                        achievements={exp.achievements}
                        technologies={exp.technologies}
                        isCurrentJob={exp.isCurrentJob}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>


      {/* Blog Section */}
      <section id="blog" className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              My <span className="text-gradient-primary">Blog</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thoughts, tutorials, and insights on cybersecurity, development, and technology.
            </p>
          </motion.div>
          
          {/* Handle different response formats */}
          {(() => {
            // Debug what we received
            // console.log('Blog API response:', blogPosts);
            
            // Extract posts from different possible response formats
            let postsArray = [];
            
            if (Array.isArray(blogPosts)) {
              postsArray = blogPosts;
            } else if (
              blogPosts &&
              typeof blogPosts === 'object' &&
              !Array.isArray(blogPosts)
            ) {
              // Handle different backend response formats
              if (
                'posts' in blogPosts &&
                Array.isArray((blogPosts as { posts?: unknown }).posts)
              ) {
                postsArray = (blogPosts as { posts: unknown[] }).posts;
              } else if (
                'data' in blogPosts &&
                Array.isArray((blogPosts as { data?: unknown }).data)
              ) {
                postsArray = (blogPosts as { data: unknown[] }).data;
              } else if (
                'items' in blogPosts &&
                Array.isArray((blogPosts as { items?: unknown }).items)
              ) {
                postsArray = (blogPosts as { items: unknown[] }).items;
              }
            }
            
            return postsArray.length === 0 ? (
              <div className="text-center py-12 glass rounded-lg">
                <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {postsArray
                  .filter(post => post && typeof post === 'object')
                  .map((post, index) => (
                    <motion.div
                      key={post._id || `blog-${index}-${Date.now()}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <BlogCard 
                        post={post}
                        onClick={() => {
                          setSelectedBlog(post);
                          setIsBlogModalOpen(true);
                        }}
                      />
                    </motion.div>
                  ))
                }
              </div>
            );
          })()}
        </div>
      </section>

      
      {/* Testimonials Section */}
        <FeedbackSection reviews={reviews} />
      
      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Let's <span className="text-gradient-primary">Connect</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a question or want to work together? Feel free to reach out!
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div 
              className="glass p-8 rounded-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                {/* Add Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className={`w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover-glow flex items-center justify-center ${
                    isSending ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="glass p-8 rounded-lg mb-8">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="text-primary" />
                    <a href="mailto:securegarv@gmail.com" className="hover:text-primary transition-colors">
                      securegarv@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Github className="text-primary" />
                    <a href="https://github.com/0xgrv" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      github.com/0xgrv
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Linkedin className="text-primary" />
                    <a href="https://www.linkedin.com/in/garvkamra/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      linkedin.com/in/garvkamra
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="glass p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
                <p className="text-muted-foreground mb-6">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                <a
                  href="https://calendly.com/garvkamra24/lets-connect"
                  target="_blank"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-lg block text-center"
                >
                  Schedule a call
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-muted-foreground py-6">
        © {new Date().getFullYear()} Garv Kamra. All rights reserved.
      </footer>
          {isBlogModalOpen && selectedBlog && (
      <BlogModal 
        post={selectedBlog} 
        onClose={() => {
          setIsBlogModalOpen(false);
          setSelectedBlog(null);
        }} 
      />
    )}
    </div>
  );
};


export default Index;
