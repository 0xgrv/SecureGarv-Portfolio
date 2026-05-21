import { useState, useEffect } from 'react';
import { Star, Quote, MessageCircle, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface FeedbackSectionProps {
  reviews: Review[];
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        aria-hidden="true"
        className={
          i < rating
            ? 'text-amber-400 fill-amber-400'
            : 'text-[#3d4452]'
        }
      />
    ))}
  </div>
);

const EmptyState = () => (
  <section id="testimonials" aria-labelledby="testimonials-heading" className="py-24 relative overflow-hidden">
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <p className="section-eyebrow">Testimonials</p>
        <h2 id="testimonials-heading" className="section-heading">
          Client <span className="text-gradient-primary">Voices</span>
        </h2>
      </div>
      <div className="max-w-md mx-auto text-center glass rounded-2xl p-12">
        <MessageCircle className="w-12 h-12 text-[#3d4452] mx-auto mb-4" aria-hidden="true" />
        <h3 className="font-display text-lg font-semibold mb-2 text-[#687081]">No Reviews Yet</h3>
        <p className="text-sm text-[#3d4452]">
          Testimonials will appear here once reviews are added.
        </p>
      </div>
    </div>
  </section>
);

const FeedbackSection = ({ reviews }: FeedbackSectionProps) => {
  const displayReviews = reviews.filter((r) => r.isActive);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || displayReviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, displayReviews.length]);

  const pauseAndGo = (next: number) => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => {
      const total = displayReviews.length;
      return ((prev + next) % total + total) % total;
    });
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  if (displayReviews.length === 0) return <EmptyState />;

  const current = displayReviews[activeIndex];
  const featuredCount = displayReviews.filter((r) => r.featured).length;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-24 relative overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-16 w-72 h-72 rounded-full bg-[#7c6af7]/8 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-16 w-72 h-72 rounded-full bg-[#3ecfb3]/6 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="section-eyebrow justify-center">Testimonials</p>
          <h2 id="testimonials-heading" className="section-heading mb-4">
            Client <span className="text-gradient-primary">Voices</span>
          </h2>
          <p className="text-[#687081] text-sm max-w-md mx-auto">
            Feedback from clients and collaborators.
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 mb-14"
        >
          {[
            { value: `${displayReviews.length}+`, label: 'Reviews' },
            { value: featuredCount > 0 ? `${featuredCount}` : '—', label: 'Featured' },
            {
              value: displayReviews.length > 0
                ? `${(
                    displayReviews.reduce((s, r) => s + r.rating, 0) /
                    displayReviews.length
                  ).toFixed(1)}`
                : '—',
              label: 'Avg Rating',
            },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="glass px-6 py-3 rounded-xl text-center"
            >
              <div className="font-display text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-[#687081] font-mono uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto relative">
          {/* Arrows */}
          {displayReviews.length > 1 && (
            <>
              <button
                onClick={() => pauseAndGo(-1)}
                aria-label="Previous testimonial"
                className="absolute -left-5 md:-left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass border border-white/8 flex items-center justify-center text-[#687081] hover:text-white hover:border-white/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => pauseAndGo(1)}
                aria-label="Next testimonial"
                className="absolute -right-5 md:-right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass border border-white/8 flex items-center justify-center text-[#687081] hover:text-white hover:border-white/20 transition-all"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Large quote mark decoration */}
              <Quote
                className="absolute top-6 right-8 w-16 h-16 text-[#7c6af7]/8 rotate-180"
                aria-hidden="true"
              />

              <div className="relative z-10">
                {/* Rating + type */}
                <div className="flex items-center justify-between mb-6">
                  <StarRating rating={current.rating} />
                  <div className="flex items-center gap-2">
                    {current.featured && (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-amber-500/25 text-amber-400 bg-amber-500/8">
                        Featured
                      </span>
                    )}
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-[rgba(124,106,247,0.2)] text-[#7c6af7] bg-[rgba(124,106,247,0.06)]">
                      {current.projectType}
                    </span>
                  </div>
                </div>

                {/* Quote text */}
                <blockquote className="mb-8">
                  <p className="text-base md:text-lg text-white/85 leading-relaxed font-light italic">
                    &ldquo;{current.text}&rdquo;
                  </p>
                </blockquote>

                {/* Author */}
                <div className="pt-6 border-t border-white/6">
                  <p className="font-display font-semibold text-white">{current.name}</p>
                  <p className="text-sm text-[#7c6af7] mt-0.5">{current.position}</p>
                  {current.company && (
                    <p className="text-sm text-[#687081] mt-0.5">{current.company}</p>
                  )}
                  {current.websiteUrl && (
                    <a
                      href={current.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${current.name}'s project`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-mono text-[#687081] hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      View Project
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          {displayReviews.length > 1 && (
            <div
              className="flex justify-center gap-1.5 mt-8"
              role="tablist"
              aria-label="Testimonial navigation"
            >
              {displayReviews.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(i);
                    setTimeout(() => setIsAutoPlaying(true), 12000);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-6 h-1.5 bg-[#7c6af7]'
                      : 'w-1.5 h-1.5 bg-[#3d4452] hover:bg-[#687081]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;