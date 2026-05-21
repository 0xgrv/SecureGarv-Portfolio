import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
  category: string;
}

/** Return badge color classes based on project category */
const getCategoryStyle = (
  category: string,
): { textColor: string; bgColor: string; borderColor: string } => {
  const lower = category.toLowerCase();
  if (
    lower.includes('security') ||
    lower.includes('vapt') ||
    lower.includes('pentest') ||
    lower.includes('red')
  ) {
    return {
      textColor: '#3ecfb3',
      bgColor: 'rgba(62,207,179,0.08)',
      borderColor: 'rgba(62,207,179,0.25)',
    };
  }
  if (
    lower.includes('hardware') ||
    lower.includes('iot') ||
    lower.includes('embedded') ||
    lower.includes('arduino')
  ) {
    return {
      textColor: '#e8a44a',
      bgColor: 'rgba(232,164,74,0.08)',
      borderColor: 'rgba(232,164,74,0.25)',
    };
  }
  return {
    textColor: '#7c6af7',
    bgColor: 'rgba(124,106,247,0.08)',
    borderColor: 'rgba(124,106,247,0.25)',
  };
};

const ProjectCard = ({
  title,
  description,
  image,
  technologies,
  githubUrl,
  liveUrl,
  category,
}: ProjectCardProps) => {
  const { textColor, bgColor, borderColor } = getCategoryStyle(category);

  return (
    <article
      className="project-card glass rounded-2xl overflow-hidden flex flex-col glass-hover"
      aria-label={`Project: ${title}`}
    >
      {/* Image */}
      <div className="project-card-img">
        <img
          src={image}
          alt={`Screenshot of ${title}`}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="project-card-overlay" aria-hidden="true" />
        <div className="project-card-overlay-hover" aria-hidden="true">
          <span
            className="px-5 py-2 rounded-lg font-display font-semibold text-sm text-white"
            style={{ background: textColor }}
          >
            View Project
          </span>
        </div>

        {/* Category badge */}
        <div
          className="absolute top-3 left-3 px-3 py-1 rounded-full font-mono text-[0.65rem] font-semibold"
          style={{ color: textColor, background: bgColor, border: `1px solid ${borderColor}` }}
          aria-label={`Category: ${category}`}
        >
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-base font-bold mb-2 text-white group-hover:text-[#7c6af7] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[#687081] mb-4 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Technologies used">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 rounded-md text-[0.7rem] font-mono border border-white/8 text-[#687081] bg-white/2"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action links */}
        <div className="flex gap-2 pt-4 border-t border-white/5">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${title}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-[#687081] hover:text-white transition-colors border border-white/8 hover:border-white/15 hover:bg-white/4"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              Code
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo for ${title}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: textColor, border: `1px solid ${borderColor}`, background: bgColor }}
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Live
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;