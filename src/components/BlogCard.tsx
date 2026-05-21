import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

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

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogCard = ({ post, onClick }: BlogCardProps) => {
  if (!post || typeof post !== 'object') return null;

  const {
    title = 'Untitled Post',
    excerpt = '',
    date = '',
    readTime = '',
    image = '',
    tags = [],
  } = post;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl glass glass-hover flex flex-col cursor-pointer h-full"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={`Read blog post: ${title}`}
    >
      {/* Image */}
      {image && (
        <div className="relative overflow-hidden h-44 flex-shrink-0">
          <img
            src={image}
            alt={`Cover image for: ${title}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).parentElement!.style.display =
                'none';
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-[#687081] font-mono">
          {date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {date}
            </span>
          )}
          {readTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {readTime}
            </span>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3" aria-label="Tags">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[0.65rem] font-mono px-2.5 py-0.5 rounded-md border border-[rgba(124,106,247,0.2)] text-[#7c6af7] bg-[rgba(124,106,247,0.06)]"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[0.65rem] font-mono px-2.5 py-0.5 rounded-md border border-white/8 text-[#687081]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <h3 className="font-display text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-[#7c6af7] transition-colors flex-1">
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm text-[#687081] leading-relaxed line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-sm font-semibold text-[#7c6af7] flex items-center gap-1.5 transition-all group-hover:gap-2.5">
            Read article
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;