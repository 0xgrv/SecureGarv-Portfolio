import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface HeroContent {
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

export interface EducationItem {
  id: string;
  type: 'education' | 'certification' | 'achievement' | 'publication';
  institution: string;
  degree: string;
  period: string;
  description: string;
  certificateLink?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
  category: string;
}

export interface Experience {
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

export interface Skill {
  _id: string;
  name: string;
  category: string;
  iconUrl?: string;
  proficiency: number;
  featured?: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export interface Review {
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

export interface PortfolioData {
  heroContent: HeroContent;
  education: EducationItem[];
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  blogPosts: BlogPost[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

// ─── Default / empty state ───────────────────────────────────────────────────

const DEFAULT_HERO: HeroContent = {
  typewriterTexts: [],
  heroParagraph: '',
  resume: { url: '', fileName: '' },
  about: { whoIAm: '', myExpertise: '', myMission: '', myJourney: '' },
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePortfolioData(): PortfolioData {
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          contentRes,
          educationRes,
          projectsRes,
          experienceRes,
          skillsRes,
          blogRes,
          reviewsRes,
        ] = await Promise.all([
          fetch(`${API_URL}/api/content`),
          fetch(`${API_URL}/api/education`),
          fetch(`${API_URL}/api/projects`),
          fetch(`${API_URL}/api/experience`),
          fetch(`${API_URL}/api/skills`),
          fetch(`${API_URL}/api/blog`),
          fetch(`${API_URL}/api/reviews`),
        ]);

        if (!contentRes.ok)    throw new Error('Failed to fetch content');
        if (!educationRes.ok)  throw new Error('Failed to fetch education');
        if (!projectsRes.ok)   throw new Error('Failed to fetch projects');
        if (!experienceRes.ok) throw new Error('Failed to fetch experience');
        if (!skillsRes.ok)     throw new Error('Failed to fetch skills');
        if (!blogRes.ok)       throw new Error('Failed to fetch blog posts');
        if (!reviewsRes.ok)    throw new Error('Failed to fetch reviews');

        const [content, edu, projs, exp, skillData, blogData, reviewsData] =
          await Promise.all([
            contentRes.json(),
            educationRes.json(),
            projectsRes.json(),
            experienceRes.json(),
            skillsRes.json(),
            blogRes.json(),
            reviewsRes.json(),
          ]);

        if (cancelled) return;

        setHeroContent(content);
        setEducation(edu);
        setProjects(projs);
        setExperiences(exp);
        setSkills(skillData);
        setReviews(reviewsData?.reviews ?? []);

        // Normalise blog response shape
        if (Array.isArray(blogData)) {
          setBlogPosts(blogData);
        } else if (Array.isArray(blogData?.posts)) {
          setBlogPosts(blogData.posts);
        } else if (Array.isArray(blogData?.data)) {
          setBlogPosts(blogData.data);
        } else {
          setBlogPosts([]);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('[usePortfolioData]', err);
        const message =
          err instanceof Error ? err.message : 'Failed to load data';
        setError(message);
        toast.error('Failed to load data. Please refresh.');

        // Reset to safe empty state — never show stale/incorrect data
        setHeroContent(DEFAULT_HERO);
        setEducation([]);
        setProjects([]);
        setExperiences([]);
        setSkills([]);
        setBlogPosts([]);
        setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    heroContent,
    education,
    projects,
    experiences,
    skills,
    blogPosts,
    reviews,
    loading,
    error,
  };
}
