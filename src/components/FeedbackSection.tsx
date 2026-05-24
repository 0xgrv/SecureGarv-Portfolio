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
  <div className="flex gap-1" aria-label={`Rating: ${rating} out of 5`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        aria-hidden="true"
        className={
          i < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-600'
        }
      />
    ))}
  </div>
);

const EmptyState = () => (
  <section id="testimonials" aria-labelledby="testimonials-heading" className="py-24 relative overflow-hidden">
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <p className="text-sm font-mono text-purple-400 uppercase tracking-wider mb-2">Testimonials</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">Voices</span>
        </h2>
      </div>
      <div className="max-w-md mx-auto text-center bg-gradient-to-br from-[#0d1220] to-[#0a0e1a] rounded-2xl border border-white/10 p-12">
        <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" aria-hidden="true" />
        <h3 className="font-display text-lg font-semibold mb-2 text-gray-400">No Reviews Yet</h3>
        <p className="text-sm text-gray-500">
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
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, displayReviews.length]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + displayReviews.length) % displayReviews.length);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % displayReviews.length);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToIndex = (idx: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(idx);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  if (displayReviews.length === 0) return <EmptyState />;

  const current = displayReviews[activeIndex];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-20 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-purple-600/5 blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-teal-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-mono text-purple-400 uppercase tracking-wider mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">Voices</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            What clients say about working with me
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-3xl mx-auto">
          {/* Card with Navigation */}
          <div className="relative">
            {/* Navigation Arrows - Desktop */}
            {displayReviews.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 transition-all items-center justify-center"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={goToNext}
                  className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 transition-all items-center justify-center"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Review Card Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-gradient-to-br from-[#0d1220] to-[#0a0e1a] rounded-2xl border border-white/10 p-6 md:p-8"
              >
                {/* Top Section - Rating and Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-white">{current.rating}.0</div>
                    <StarRating rating={current.rating} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {current.featured && (
                      <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {current.projectType}
                    </span>
                  </div>
                </div>

                {/* Quote Text */}
                <div className="mb-8">
                  <Quote size={32} className="text-purple-500/30 mb-4" />
                  <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                    "{current.text}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg">{current.name}</h4>
                      <p className="text-purple-400 text-sm">{current.position}</p>
                      {current.company && (
                        <p className="text-gray-500 text-sm">{current.company}</p>
                      )}
                    </div>
                    {current.websiteUrl && (
                      <a
                        href={current.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/20 hover:border-purple-500/40 transition-all"
                      >
                        <ExternalLink size={14} />
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          {displayReviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {displayReviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${idx === activeIndex
                    ? 'w-8 h-2 bg-gradient-to-r from-purple-500 to-teal-500'
                    : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile Navigation Arrows */}
          {displayReviews.length > 1 && (
            <div className="flex justify-center gap-4 mt-6 md:hidden">
              <button
                onClick={goToPrev}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 transition-all flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 transition-all flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{displayReviews.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {displayReviews.filter(r => r.featured).length}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {(displayReviews.reduce((s, r) => s + r.rating, 0) / displayReviews.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;