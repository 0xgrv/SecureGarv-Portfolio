import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Skill {
  _id: string;
  name: string;
  category: string;
  featured?: boolean;
}

interface MarqueeSkillsProps {
  skills: Skill[];
}

/** Map backend category names to visual classes */
const getCategoryClass = (category: string): string => {
  const lower = category.toLowerCase();
  if (
    lower.includes('security') ||
    lower.includes('vapt') ||
    lower.includes('pentest') ||
    lower.includes('red') ||
    lower.includes('network') ||
    lower.includes('offensive') ||
    lower.includes('defensive')
  ) {
    return 'cat-security';
  }
  if (
    lower.includes('hardware') ||
    lower.includes('iot') ||
    lower.includes('embedded') ||
    lower.includes('arduino') ||
    lower.includes('robotics')
  ) {
    return 'cat-hardware';
  }
  return 'cat-dev';
};

const getDotColor = (cls: string): string => {
  if (cls === 'cat-security') return '#3ecfb3';
  if (cls === 'cat-hardware') return '#e8a44a';
  return '#7c6af7';
};

const MarqueeSkills = ({ skills }: MarqueeSkillsProps) => {
  const [row1, row2] = useMemo(() => {
    if (!skills.length) return [[], []];
    // Featured skills go first
    const sorted = [
      ...skills.filter((s) => s.featured),
      ...skills.filter((s) => !s.featured),
    ];
    const mid = Math.ceil(sorted.length / 2);
    return [sorted.slice(0, mid), sorted.slice(mid)];
  }, [skills]);

  if (!skills.length) return null;

  const renderPill = (skill: Skill, idx: number) => {
    const catCls = getCategoryClass(skill.category);
    const dotColor = getDotColor(catCls);
    return (
      <span
        key={`${skill._id}-${idx}`}
        className={`skill-pill ${catCls} ${skill.featured ? 'featured' : ''}`}
        aria-label={skill.name}
      >
        <span
          className="pill-dot"
          style={{ background: dotColor }}
          aria-hidden="true"
        />
        {skill.name}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      aria-label="Skills list"
    >
      {/* Row 1 — left */}
      <div className="marquee-outer mb-3">
        <div className="flex">
          <div className="marquee-track">
            {row1.map((s, i) => renderPill(s, i))}
            {/* duplicate for seamless loop */}
            {row1.map((s, i) => renderPill(s, row1.length + i))}
          </div>
        </div>
      </div>

      {/* Row 2 — right */}
      <div className="marquee-outer">
        <div className="flex">
          <div className="marquee-track marquee-track-reverse">
            {row2.map((s, i) => renderPill(s, i))}
            {row2.map((s, i) => renderPill(s, row2.length + i))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarqueeSkills;
