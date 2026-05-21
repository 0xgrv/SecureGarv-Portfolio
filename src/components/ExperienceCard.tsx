import { MapPin, CheckSquare, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperienceCardProps {
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

const ExperienceCard = ({
  company,
  position,
  location,
  startDate,
  endDate,
  description,
  achievements = [],
  technologies = [],
  isCurrentJob,
}: ExperienceCardProps) => {
  return (
    <motion.div
      className={`exp-chronicle ${isCurrentJob ? 'is-current' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Left meta column */}
      <div className="exp-chronicle-meta">
        {isCurrentJob && (
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#3ecfb3] inline-block flex-shrink-0"
              style={{ boxShadow: '0 0 6px rgba(62,207,179,0.6)' }}
            />
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#3ecfb3]">
              Current
            </span>
          </div>
        )}
        <div className="exp-chronicle-year">Period</div>
        <div className="exp-chronicle-dates">
          <span>{startDate}</span>
          <span className="text-[#3d4452]">—</span>
          <span>{isCurrentJob ? 'Present' : endDate}</span>
        </div>
        {location && (
          <div className="exp-chronicle-location flex items-center gap-1 mt-2">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {location}
          </div>
        )}
      </div>

      {/* Right content column */}
      <div className="exp-chronicle-content">
        <h3 className="exp-company-name">{company}</h3>
        <p className="exp-position-title">{position}</p>

        {description && (
          <p className="exp-description">{description}</p>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckSquare
                className="w-3.5 h-3.5 text-[#687081]"
                aria-hidden="true"
              />
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#3d4452]">
                Key Contributions
              </span>
            </div>
            <ul className="space-y-1.5" aria-label="Achievements">
              {achievements.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-[#687081] leading-relaxed flex items-start gap-2"
                >
                  <span
                    className="w-1 h-1 rounded-full bg-[#7c6af7] mt-2 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Cpu
                className="w-3.5 h-3.5 text-[#687081]"
                aria-hidden="true"
              />
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#3d4452]">
                Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5" aria-label="Technologies used">
              {technologies.map((tech) => (
                <span key={tech} className="exp-tag exp-tag-primary">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExperienceCard;