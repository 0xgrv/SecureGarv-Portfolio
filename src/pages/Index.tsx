import { useRef, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TypeAnimation } from 'react-type-animation';
import {
  ArrowRight,
  Shield,
  Code2,
  GraduationCap,
  Brain,
  Rocket,
  BookOpen,
  Users,
  Briefcase,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Terminal,
  Cpu,
  Heart,
  Globe,
  CalendarCheck,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';

import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';
import MainNav from '../components/MainNav';
import MarqueeSkills from '../components/MarqueeSkills';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import FeedbackSection from '../components/FeedbackSection';
import { usePortfolioData } from '../hooks/usePortfolioData';

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

// ─── Section heading helper ───────────────────────────────────────────────────

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={fadeUp}
    className={`mb-14 ${centered ? 'text-center' : ''}`}
  >
    <p className={`section-eyebrow ${centered ? 'justify-center' : ''}`}>
      {eyebrow}
    </p>
    <h2 className="section-heading mb-4">{title}</h2>
    {subtitle && (
      <p
        className={`text-[#687081] text-sm max-w-xl leading-relaxed ${centered ? 'mx-auto' : ''
          }`}
      >
        {subtitle}
      </p>
    )}
  </motion.div>
);

// ─── Education helpers ────────────────────────────────────────────────────────

const EDU_ICON_MAP = {
  education: { icon: GraduationCap, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
  certification: { icon: Shield, color: '#3ecfb3', bg: 'rgba(62,207,179,0.1)', border: 'rgba(62,207,179,0.2)' },
  achievement: { icon: Rocket, color: '#e8a44a', bg: 'rgba(232,164,74,0.1)', border: 'rgba(232,164,74,0.2)' },
  publication: { icon: BookOpen, color: '#f06b8b', bg: 'rgba(240,107,139,0.1)', border: 'rgba(240,107,139,0.2)' },
} as const;

type EduType = keyof typeof EDU_ICON_MAP;

// ─── Contact form ─────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Main component ───────────────────────────────────────────────────────────

const Index = () => {
  const location = useLocation();
  const blogSectionRef = useRef<HTMLElement>(null);

  // Data
  const {
    heroContent,
    education,
    projects,
    experiences,
    skills,
    blogPosts,
    reviews,
    community,
    loading,
  } = usePortfolioData();

  // Blog modal
  const [selectedBlog, setSelectedBlog] = useState<(typeof blogPosts)[0] | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Education filter
  const [activeFilter, setActiveFilter] = useState<'all' | EduType>('all');

  // Contact form
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '',
  });

  // Scroll to blog section if routed here
  useEffect(() => {
    if (location.state?.scrollToBlog && blogSectionRef.current) {
      blogSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Typewriter sequence
  const typeSequence = useMemo(
    () => heroContent.typewriterTexts.flatMap((t) => [t, 2200]),
    [heroContent.typewriterTexts],
  );

  // Education counts & filtered list
  const eduCounts = useMemo(
    () => ({
      all: education.length,
      education: education.filter((e) => e.type === 'education').length,
      certification: education.filter((e) => e.type === 'certification').length,
      achievement: education.filter((e) => e.type === 'achievement').length,
      publication: education.filter((e) => e.type === 'publication').length,
    }),
    [education],
  );

  const filteredEdu = useMemo(
    () => (activeFilter === 'all' ? education : education.filter((e) => e.type === activeFilter)),
    [education, activeFilter],
  );

  // Contact handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let sanitized = value;
    // Strip digits from name field
    if (name === 'name') sanitized = value.replace(/[0-9]/g, '');
    setFormData((prev) => ({ ...prev, [name]: sanitized }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }
    if (formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    if (formData.subject.trim().length < 5) {
      toast.error('Subject must be at least 5 characters');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    const blockedDomains = [
      'tempmail.com', 'mailinator.com', 'guerrillamail.com',
      '10minutemail.com', 'throwawaymail.com', 'fakeinbox.com',
      'yopmail.com', 'trashmail.com', 'maildrop.cc',
    ];
    const domain = formData.email.split('@')[1];
    if (blockedDomains.some((d) => domain.includes(d))) {
      toast.error('Please use a permanent email address');
      return;
    }
    if (formData.message.trim().length < 10) {
      toast.error('Message should be at least 10 characters');
      return;
    }

    setIsSending(true);
    try {
      // Send via Web3Forms
      const web3 = new FormData();
      web3.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY);
      web3.append('name', formData.name);
      web3.append('email', formData.email);
      web3.append('subject', formData.subject);
      web3.append('message', formData.message);
      web3.append('botcheck', '');

      const w3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3,
      });
      const w3Data = await w3Res.json();
      if (!w3Res.ok || !w3Data.success) throw new Error(w3Data.message || 'Web3Forms failed');

      // Mirror to backend
      const beRes = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          isRead: false,
          isStarred: false,
          isArchived: false,
        }),
      });

      if (!beRes.ok) {
        const beData = await beRes.json();
        throw new Error(beData.error || 'Backend submission failed');
      }

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        toast.error('Network error — please check your connection');
      } else {
        toast.error((err as Error).message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-[#7c6af7]/20" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-t-[#7c6af7] animate-spin" />
        </div>
        <span className="sr-only">Loading portfolio content…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#e8edf5] overflow-x-hidden">
      {/* Ambient background — fixed, behind everything */}
      <div aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
        <div className="grid-overlay" />
      </div>

      <MainNav />

      <main id="main-content">
        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <section
          id="home"
          aria-label="Introduction"
          className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text column */}
              <div>
                <motion.p
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="font-mono text-xs tracking-[4px] uppercase text-[#3ecfb3] mb-6"
                >
                  Security Analyst · VAPT · Writer
                </motion.p>

                <motion.h1
                  custom={0.08}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="font-display font-bold leading-[1.05] tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2.6rem, 9vw, 5.5rem)' }}
                >
                  <span className="block text-[#e8edf5]">Garv</span>
                  <span className="block text-gradient-hero">Kamra</span>
                </motion.h1>

                {/* Typewriter */}
                {typeSequence.length > 0 && (
                  <motion.div
                    custom={0.16}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="flex items-center gap-2 mb-6"
                    aria-live="polite"
                    aria-label="Current role"
                  >
                    <Terminal className="w-4 h-4 text-[#7c6af7] flex-shrink-0" aria-hidden="true" />
                    <TypeAnimation
                      sequence={typeSequence}
                      wrapper="span"
                      speed={55}
                      repeat={Infinity}
                      className="font-mono text-sm text-[#a594ff]"
                    />
                  </motion.div>
                )}

                {(heroContent.heroParagraph) && (
                  <motion.p
                    custom={0.22}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="text-[#687081] text-base leading-relaxed max-w-lg mb-8"
                  >
                    {heroContent.heroParagraph}
                  </motion.p>
                )}

                {/* CTAs */}
                <motion.div
                  custom={0.28}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="flex flex-wrap gap-3 mb-10"
                >
                  {heroContent.resume?.url && (
                    <a
                      href={heroContent.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download resume (opens in new tab)"
                      className="btn-primary"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      Download Resume
                    </a>
                  )}
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-ghost"
                  >
                    Get in Touch
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </motion.div>

                {/* Role badge strip — dynamic from backend */}
                {heroContent.heroTags && heroContent.heroTags.length > 0 && (
                  <motion.div
                    custom={0.34}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="flex flex-wrap gap-2"
                    aria-label="Key identities"
                  >
                    {heroContent.heroTags.map(({ label, color }) => (
                      <span key={label} className="hero-role-badge">
                        <span className="dot" style={{ background: color }} aria-hidden="true" />
                        {label}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Avatar column */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="hidden lg:flex flex-col items-center gap-8"
              >
                {/* Avatar with gradient border frame */}
                <div
                  className="hero-avatar-frame"
                  style={{ animation: 'float 7s ease-in-out infinite' }}
                >
                  <img
                    src="/hero.png"
                    alt="Garv Kamra — Security Analyst and Poet"
                    width={340}
                    height={400}
                    className="rounded-[20px] object-cover block"
                    style={{ width: 320, height: 380 }}
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            ABOUT
        ═══════════════════════════════════════ */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="py-24 relative z-10"
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="About"
              title={
                <>
                  More Than a <span className="text-gradient-primary">Cyber Analyst</span>
                </>
              }
              subtitle="Curiosity built me. Security sharpened me. Words define me."
            />
            <h2 id="about-heading" className="sr-only">About Garv Kamra</h2>

            {/* Bento grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {[
                {
                  icon: Brain,
                  iconColor: '#7c6af7',
                  iconBg: 'rgba(124,106,247,0.1)',
                  borderHover: 'rgba(124,106,247,0.3)',
                  title: 'Who I Am',
                  text: heroContent.about?.whoIAm,
                  delay: 0,
                },
                {
                  icon: Shield,
                  iconColor: '#3ecfb3',
                  iconBg: 'rgba(62,207,179,0.1)',
                  borderHover: 'rgba(62,207,179,0.3)',
                  title: 'My Expertise',
                  text: heroContent.about?.myExpertise,
                  delay: 0.08,
                },
                {
                  icon: Rocket,
                  iconColor: '#e8a44a',
                  iconBg: 'rgba(232,164,74,0.1)',
                  borderHover: 'rgba(232,164,74,0.3)',
                  title: 'My Mission',
                  text: heroContent.about?.myMission,
                  delay: 0.16,
                },
              ].map(({ icon: Icon, iconColor, iconBg, borderHover, title, text, delay }) => (
                <motion.div
                  key={title}
                  custom={delay}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="glass rounded-2xl p-7 glass-hover group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: iconBg }}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" style={{ color: iconColor }} />
                  </div>
                  <h3 className="font-display text-base font-semibold mb-3 text-white">
                    {title}
                  </h3>
                  <p className="text-sm text-[#687081] leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>

            {/* Beyond the Terminal — full width */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.2}
              className="glass rounded-2xl p-7 glass-amber-hover"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(232,164,74,0.1)' }}
                  aria-hidden="true"
                >
                  <BookOpen className="w-5 h-5" style={{ color: '#e8a44a' }} />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-display text-base font-semibold mb-2 text-white">
                    Beyond the Terminal
                  </h3>
                  <p className="text-sm text-[#687081] leading-relaxed">
                    When I am not testing APIs or staring at Burpsuite, I write. I have published a few poetry collections on Amazon because words have always been the other side of how I think. Not everything translates to a terminal.
                    I also volunteer with the{' '}
                    <a
                      href="https://securityboat.net/chapter/bengaluru/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3ecfb3] hover:underline"
                    >
                      SecurityBoat Community
                    </a>
                    , helping run monthly cybersecurity meetups and handling the behind the scenes stuff. It is one of those things I genuinely enjoy doing.
                  </p>
                </div>
                <a
                  href="https://www.amazon.in/stores/Garv-Kamra/author/B0FJWL3F7D/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Amazon author page"
                  className="flex items-center gap-1.5 text-xs font-mono text-[#687081] hover:text-white transition-colors flex-shrink-0 sm:mt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  Author Page
                </a>
              </div>
            </motion.div>
            {/* Journey */}
            {heroContent.about?.myJourney && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0.24}
                className="glass rounded-2xl p-7 glass-hover mt-6"
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-0.5 self-stretch rounded-full flex-shrink-0 mt-1"
                    style={{
                      background: 'linear-gradient(to bottom, #7c6af7, #3ecfb3, transparent)',
                    }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-base font-semibold mb-3 text-white">
                      From Curiosity to Cybersecurity
                    </h3>
                    <p className="text-sm text-[#687081] leading-relaxed whitespace-pre-wrap">
                      {heroContent.about.myJourney}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Skills marquee */}
            <div className="mt-16">
              <motion.h3
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="font-display text-xl font-bold text-center mb-8"
              >
                My <span className="text-gradient-teal">Arsenal</span>
              </motion.h3>
              <MarqueeSkills skills={skills} />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            EDUCATION & CREDENTIALS
        ═══════════════════════════════════════ */}
        <section
          id="education"
          aria-labelledby="education-heading"
          className="py-24 relative z-10"
          style={{ background: 'rgba(124,106,247,0.02)' }}
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Education"
              title={
                <>
                  Education &{' '}
                  <span className="text-gradient-primary">Credentials</span>
                </>
              }
              subtitle="Academic background, certifications, achievements, and publications."
            />
            <h2 id="education-heading" className="sr-only">Education and Credentials</h2>

            {/* Filter pill group */}
            <div className="flex justify-center mb-12">
              <div className="filter-group flex-wrap" role="group" aria-label="Filter credentials">
                {(
                  [
                    { key: 'all', label: 'All', count: eduCounts.all },
                    { key: 'education', label: 'Education', count: eduCounts.education },
                    { key: 'certification', label: 'Certs', count: eduCounts.certification },
                    { key: 'achievement', label: 'Achievements', count: eduCounts.achievement },
                    { key: 'publication', label: 'Publications', count: eduCounts.publication },
                  ] as { key: 'all' | EduType; label: string; count: number }[]
                ).map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
                    aria-pressed={activeFilter === key}
                    aria-label={`${label} (${count} items)`}
                  >
                    {label}
                    {count > 0 && (
                      <span
                        className="ml-1.5 text-[0.65rem] opacity-70"
                        aria-hidden="true"
                      >
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {filteredEdu.length === 0 ? (
              <p className="text-center text-[#687081] py-10">No items for this filter.</p>
            ) : (
              <div className="max-w-2xl mx-auto relative pl-8">
                {/* Vertical timeline line */}
                <div className="edu-timeline-line" aria-hidden="true" />

                <div className="space-y-6">
                  {filteredEdu.map((item, i) => {
                    const cfg = EDU_ICON_MAP[item.type as EduType] ?? EDU_ICON_MAP.education;
                    const Icon = cfg.icon;
                    return (
                      <motion.article
                        key={item.id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={fadeLeft}
                        custom={i * 0.07}
                        className="glass rounded-xl p-6 relative glass-hover"
                        aria-label={`${item.type}: ${item.institution}`}
                      >
                        {/* Timeline dot */}
                        <div
                          className="edu-timeline-dot"
                          style={{ background: cfg.bg, border: `2px solid ${cfg.border}` }}
                          aria-hidden="true"
                        >
                          <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                        </div>

                        <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                          <h3 className="font-display font-semibold text-white text-base">
                            {item.institution}
                          </h3>
                          <span
                            className="text-[0.65rem] font-mono px-2.5 py-1 rounded-full"
                            style={{
                              color: cfg.color,
                              background: cfg.bg,
                              border: `1px solid ${cfg.border}`,
                            }}
                          >
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1" style={{ color: cfg.color }}>
                          {item.degree}
                        </p>
                        <p className="text-xs font-mono text-[#3d4452] mb-3">{item.period}</p>
                        <p className="text-sm text-[#687081] leading-relaxed">{item.description}</p>
                        {item.certificateLink && (
                          <a
                            href={item.certificateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View certificate for ${item.degree}`}
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-mono text-[#687081] hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            View Certificate
                          </a>
                        )}
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            PROJECTS
        ═══════════════════════════════════════ */}
        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="py-24 relative z-10"
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Work"
              title={
                <>
                  Things I've <span className="text-gradient-primary">Built</span>
                </>
              }
              subtitle="Security tools, web applications, and hardware experiments."
            />
            <h2 id="projects-heading" className="sr-only">Projects</h2>

            {projects.length === 0 ? (
              <p className="text-center text-[#687081] py-10">No projects yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={fadeUp}
                    custom={i * 0.07}
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
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            EXPERIENCE
        ═══════════════════════════════════════ */}
        <section
          id="experience"
          aria-labelledby="experience-heading"
          className="py-24 relative z-10"
          style={{ background: 'rgba(124,106,247,0.02)' }}
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Experience"
              title={
                <>
                  Professional <span className="text-gradient-teal">Timeline</span>
                </>
              }
              subtitle="Roles, engagements, and contributions over the years."
            />
            <h2 id="experience-heading" className="sr-only">Professional Experience</h2>

            {experiences.length === 0 ? (
              <p className="text-center text-[#687081] py-10">No experience entries yet.</p>
            ) : (
              <div className="max-w-3xl mx-auto">
                {experiences.map((exp) => (
                  <ExperienceCard
                    key={exp._id}
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
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            COMMUNITY — standalone section
        ═══════════════════════════════════════ */}
        <section
          id="community"
          aria-labelledby="community-heading"
          className="py-24 relative z-10"
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Community"
              title={
                <>
                  Giving Back to <span className="text-gradient-teal">Security</span>
                </>
              }
              subtitle="Volunteering, teaching, and building a more inclusive security ecosystem."
            />
            <h2 id="community-heading" className="sr-only">Community and Volunteering</h2>

            {/* Community layout — always shows both side blurb cards (like About section bento) */}
            {(() => {
              const featured = community.find((c) => c.isFeatured) ?? community[0] ?? null;
              const sidecards = featured
                ? community.filter((c) => c._id !== featured._id).slice(0, 2)
                : [];

              return (
                <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-5">
                  {/* Primary card */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={0}
                    className="md:col-span-3 glass rounded-2xl p-8 glass-teal-hover"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(62,207,179,0.1)', border: '1px solid rgba(62,207,179,0.2)' }}
                        aria-hidden="true"
                      >
                        <Globe className="w-6 h-6" style={{ color: '#3ecfb3' }} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-white mb-1">
                          {featured?.organisation ?? 'SecurityBoat Community'}
                        </h3>
                        <p className="text-sm text-[#3ecfb3] font-mono">
                          {featured?.role ?? 'Cybersecurity Volunteer'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#687081] leading-relaxed mb-6">
                      {featured?.description ??
                        'Active volunteer contributing through workshops, content creation, and mentoring aspiring security professionals.'}
                    </p>
                    {(featured?.activities ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6" aria-label="Activities">
                        {(featured!.activities).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-mono px-3 py-1 rounded-full"
                            style={{
                              color: '#3ecfb3',
                              background: 'rgba(62,207,179,0.08)',
                              border: '1px solid rgba(62,207,179,0.2)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {featured?.websiteUrl && (
                      <a
                        href={featured.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${featured.organisation} website`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#3ecfb3] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        Visit {featured.organisation}
                      </a>
                    )}
                  </motion.div>

                  {/* Side cards — always two, either from extra entries or default blurbs */}
                  <div className="md:col-span-2 flex flex-col gap-5">
                    {sidecards.length >= 1 ? (
                      <motion.div
                        key={sidecards[0]._id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0.08}
                        className="glass rounded-2xl p-6 glass-hover flex-1"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                          style={{ background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)' }}
                          aria-hidden="true"
                        >
                          <Users className="w-5 h-5" style={{ color: '#7c6af7' }} />
                        </div>
                        <h3 className="font-display font-semibold text-white text-sm mb-1">{sidecards[0].organisation}</h3>
                        <p className="text-xs text-[#3ecfb3] font-mono mb-2">{sidecards[0].role}</p>
                        <p className="text-xs text-[#687081] leading-relaxed">
                          {sidecards[0].whyVolunteer || sidecards[0].description}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0.1}
                        className="glass rounded-2xl p-6 glass-hover flex-1"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                          style={{ background: 'rgba(240,107,139,0.1)', border: '1px solid rgba(240,107,139,0.2)' }}
                          aria-hidden="true"
                        >
                          <Heart className="w-5 h-5" style={{ color: '#f06b8b' }} />
                        </div>
                        <h3 className="font-display font-semibold text-white text-sm mb-2">
                          {featured?.whyVolunteer ? 'Why I Volunteer' : 'Open Knowledge'}
                        </h3>
                        <p className="text-xs text-[#687081] leading-relaxed">
                          {featured?.whyVolunteer ||
                            'Security knowledge hoarded is security knowledge wasted. Sharing is how the field moves forward.'}
                        </p>
                      </motion.div>
                    )}

                    {sidecards.length >= 2 ? (
                      <motion.div
                        key={sidecards[1]._id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0.16}
                        className="glass rounded-2xl p-6 glass-hover flex-1"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                          style={{ background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)' }}
                          aria-hidden="true"
                        >
                          <Users className="w-5 h-5" style={{ color: '#7c6af7' }} />
                        </div>
                        <h3 className="font-display font-semibold text-white text-sm mb-1">{sidecards[1].organisation}</h3>
                        <p className="text-xs text-[#3ecfb3] font-mono mb-2">{sidecards[1].role}</p>
                        <p className="text-xs text-[#687081] leading-relaxed">
                          {sidecards[1].whyVolunteer || sidecards[1].description}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0.18}
                        className="glass rounded-2xl p-6 glass-hover flex-1"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                          style={{ background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)' }}
                          aria-hidden="true"
                        >
                          <Users className="w-5 h-5" style={{ color: '#7c6af7' }} />
                        </div>
                        <h3 className="font-display font-semibold text-white text-sm mb-2">
                          Community First
                        </h3>
                        <p className="text-xs text-[#687081] leading-relaxed">
                          Helping newcomers navigate the overwhelming landscape of cybersecurity — one
                          resource, one conversation at a time.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        </section>

        {/* ═══════════════════════════════════════
            BLOG & PUBLICATIONS
        ═══════════════════════════════════════ */}
        <section
          id="blog"
          aria-labelledby="blog-heading"
          className="py-24 relative z-10"
          ref={blogSectionRef as React.RefObject<HTMLElement>}
          style={{ background: 'rgba(124,106,247,0.02)' }}
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Writings"
              title={
                <>
                  From the <span className="text-gradient-amber">Notebook</span>
                </>
              }
              subtitle="Security writeups, red team notes, and the occasional poem."
            />
            <h2 id="blog-heading" className="sr-only">Blog and Publications</h2>

            {/* Publications highlight — dynamic from backend */}
            {heroContent.publications?.isVisible && heroContent.publications?.url && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass rounded-2xl p-6 mb-12 glass-amber-hover max-w-3xl mx-auto"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(232,164,74,0.1)', border: '1px solid rgba(232,164,74,0.2)' }}
                    aria-hidden="true"
                  >
                    <BookOpen className="w-5 h-5" style={{ color: '#e8a44a' }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[#e8a44a] mb-1">
                      Published Works
                    </p>
                    <h3 className="font-display font-semibold text-white text-base mb-2">
                      {heroContent.publications.title}
                    </h3>
                    {heroContent.publications.description && (
                      <p className="text-sm text-[#687081] leading-relaxed">
                        {heroContent.publications.description}
                      </p>
                    )}
                  </div>
                  <a
                    href={heroContent.publications.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${heroContent.publications.title}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono flex-shrink-0 mt-1 px-3 py-2 rounded-lg transition-colors"
                    style={{
                      color: '#e8a44a',
                      background: 'rgba(232,164,74,0.06)',
                      border: '1px solid rgba(232,164,74,0.2)',
                    }}
                  >
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    {heroContent.publications.buttonLabel || 'View Books'}
                  </a>
                </div>
              </motion.div>
            )}

            {/* Blog posts grid */}
            {(() => {
              const posts = Array.isArray(blogPosts) ? blogPosts : [];
              if (posts.length === 0) {
                return (
                  <p className="text-center text-[#687081] py-10 glass rounded-xl">
                    No blog posts yet. Check back soon.
                  </p>
                );
              }
              return (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {posts
                    .filter((p) => p && typeof p === 'object')
                    .map((post, i) => (
                      <motion.div
                        key={post._id ?? `post-${i}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={fadeUp}
                        custom={i * 0.07}
                      >
                        <BlogCard
                          post={post}
                          onClick={() => {
                            setSelectedBlog(post);
                            setIsBlogModalOpen(true);
                          }}
                        />
                      </motion.div>
                    ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════ */}
        <FeedbackSection reviews={reviews} />

        {/* ═══════════════════════════════════════
            CONTACT
        ═══════════════════════════════════════ */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="py-24 relative z-10"
        >
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Contact"
              title={
                <>
                  Let's <span className="text-gradient-primary">Connect</span>
                </>
              }
              subtitle="VAPT engagement, project collaboration, or just a conversation — reach out."
            />
            <h2 id="contact-heading" className="sr-only">Contact Garv Kamra</h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Form */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeLeft}
                className="glass rounded-2xl p-7"
              >
                <h3 className="font-display font-semibold text-base text-white mb-6">
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                  <div className="space-y-4 mb-5">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        placeholder=" "
                        value={formData.name}
                        onChange={handleChange}
                        required
                        aria-label="Your name"
                        autoComplete="name"
                      />
                      <label htmlFor="contact-name">Your Name</label>
                    </div>
                    <div className="form-floating">
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        placeholder=" "
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-label="Email address"
                        autoComplete="email"
                      />
                      <label htmlFor="contact-email">Email Address</label>
                    </div>
                    <div className="form-floating">
                      <input
                        type="text"
                        id="contact-subject"
                        name="subject"
                        placeholder=" "
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        aria-label="Subject"
                      />
                      <label htmlFor="contact-subject">Subject</label>
                    </div>
                    <div className="form-floating">
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        placeholder=" "
                        value={formData.message}
                        onChange={handleChange}
                        required
                        aria-label="Your message"
                        style={{ resize: 'none' }}
                      />
                      <label htmlFor="contact-message">Your Message</label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    aria-label={isSending ? 'Sending message…' : 'Send message'}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <span
                          className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                          aria-hidden="true"
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="flex flex-col gap-5"
              >
                <div className="glass rounded-2xl p-7">
                  <h3 className="font-display font-semibold text-base text-white mb-5">
                    Contact Information
                  </h3>
                  <address className="not-italic space-y-3">
                    {[
                      {
                        icon: Mail,
                        href: 'mailto:securegarv@gmail.com',
                        label: 'securegarv@gmail.com',
                        sublabel: 'Preferred contact',
                        external: false,
                      },
                      {
                        icon: Github,
                        href: 'https://github.com/0xgrv',
                        label: 'github.com/0xgrv',
                        sublabel: 'Open source',
                        external: true,
                      },
                      {
                        icon: Linkedin,
                        href: 'https://www.linkedin.com/in/garvkamra/',
                        label: 'linkedin.com/in/garvkamra',
                        sublabel: 'Professional',
                        external: true,
                      },
                    ].map(({ icon: Icon, href, label, sublabel, external }) => (
                      <a
                        key={href}
                        href={href}
                        aria-label={sublabel ? `${label} — ${sublabel}` : label}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-colors group"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.18)' }}
                          aria-hidden="true"
                        >
                          <Icon className="w-4 h-4 text-[#7c6af7]" />
                        </div>
                        <div>
                          <p className="text-sm text-white group-hover:text-[#7c6af7] transition-colors">
                            {label}
                          </p>
                          {sublabel && (
                            <p className="text-xs text-[#3d4452] font-mono">{sublabel}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </address>
                </div>

                {/* Calendly */}
                <div className="glass rounded-2xl p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <CalendarCheck className="w-5 h-5 text-[#7c6af7]" aria-hidden="true" />
                    <h3 className="font-display font-semibold text-base text-white">
                      Schedule a Call
                    </h3>
                  </div>
                  <p className="text-sm text-[#687081] mb-4 leading-relaxed">
                    Have a security project or want to collaborate? Book a slot directly.
                  </p>
                  <a
                    href="https://calendly.com/garvkamra24/lets-connect"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Book a call on Calendly"
                    className="btn-ghost w-full justify-center"
                  >
                    Book on Calendly
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer
        aria-label="Site footer"
        className="relative z-10 border-t border-white/5 pt-14 pb-8"
      >
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <p className="font-mono font-bold text-lg mb-3">
                <span className="text-[#7c6af7]">.</span>SecureGarv
              </p>
              <p className="text-sm text-[#687081] leading-relaxed mb-5 max-w-xs">
                Security Analyst · VAPT · Poet <br />
                Volunteering
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: Github, href: 'https://github.com/0xgrv/', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/garvkamra/', label: 'LinkedIn' },
                  { icon: Briefcase, href: 'https://www.amazon.in/stores/Garv-Kamra/author/B0FJWL3F7D/', label: 'Books' },
                  { icon: Mail, href: 'mailto:securegarv@gmail.com', label: 'Email' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-[#687081] hover:text-white hover:border-white/20 transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <nav aria-label="Footer navigation">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[#3d4452] mb-4">
                Navigate
              </p>
              <ul className="space-y-2">
                {[
                  ['#about', 'About'],
                  ['#projects', 'Projects'],
                  ['#experience', 'Experience'],
                  ['#community', 'Community'],
                  ['#blog', 'Blog'],
                  ['#contact', 'Contact'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-sm text-[#687081] hover:text-white transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Currently */}
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[#3d4452] mb-4">
                Currently
              </p>
              <ul className="space-y-2">
                {[
                  { icon: Terminal, text: 'Learning Red Teaming' },
                  { icon: Cpu, text: 'Hardware Security Research' },
                  { icon: BookOpen, text: 'Writing & Publishing' },
                  { icon: Globe, text: 'Volunteering @ SecurityBoat Community' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-sm text-[#687081]">
                    <Icon className="w-3.5 h-3.5 text-[#3d4452] flex-shrink-0" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#3d4452] font-mono">
            <p>© {new Date().getFullYear()} Garv Kamra. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with
              <Heart className="w-3 h-3 text-[#f06b8b]" aria-hidden="true" />
              and a lot of coffee.
            </p>
          </div>
        </div>
      </footer>

      {/* Blog modal */}
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
