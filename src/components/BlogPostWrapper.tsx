// components/BlogPostWrapper.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogModal from "@/components/BlogModal";
import { BlogPost } from "@/components/BlogCard";

const API_URL = import.meta.env.VITE_API_URL || 'https://api.securegarv.me';

const BlogPostWrapper = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('No post identifier provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Your backend accepts both ID and slug
        const response = await fetch(`${API_URL}/api/blog/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const postData = await response.json();
        setPost(postData);
        setError(null);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleClose = () => {
    // Go back to homepage and scroll to blog section
    navigate('/', { state: { scrollToBlog: true } });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <p className="text-gray-400 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <BlogModal post={post} onClose={handleClose} />;
};

export default BlogPostWrapper;