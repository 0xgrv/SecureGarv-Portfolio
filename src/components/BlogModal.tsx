import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, ArrowLeft, Link as LinkIcon, Share } from "lucide-react";
import { useEffect, useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  slug?: string;
}

interface BlogModalProps {
  post: BlogPost;
  onClose: () => void;
}

const BlogModal = ({ post, onClose }: BlogModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCopyLink = async () => {
    // Use slug if available (better for SEO), otherwise use ID
    const identifier = post.slug || post._id;
    const shareUrl = `${window.location.origin}/blog/${identifier}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.log('Error copying to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background z-50 overflow-y-auto"
      >
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-[#2d3748] z-10"
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Back to Portfolio</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                aria-label="Copy link to this post"
              >
                {isCopied ? (
                  <>
                    <span className="text-sm">Copied!</span>
                    <Share className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span className="text-sm">Share</span>
                    <Share className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#2d3748] transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Article Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert max-w-none"
          >
            {/* Article Header */}
            <header className="mb-12 text-center">
              {/* Responsive Tags Container */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-2 mb-6 px-2"
              >
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs sm:text-sm bg-primary/20 text-primary px-3 py-1.5 rounded-full border border-primary/30 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight px-4"
              >
                {post.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto px-4"
              >
                {post.excerpt}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground px-4"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-[#2d3748]"></div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-[#2d3748]"></div>
                <div className="flex items-center gap-2">
                  <span>By Garv Kamra</span>
                </div>
              </motion.div>
            </header>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-12 rounded-2xl overflow-hidden mx-4 sm:mx-0"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto max-h-96 object-cover"
              />
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="px-4 sm:px-0"
            />

            {/* Article Footer */}
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-16 pt-8 border-t border-[#2d3748] mx-4 sm:mx-0"
            >
            </motion.footer>
          </motion.article>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogModal;