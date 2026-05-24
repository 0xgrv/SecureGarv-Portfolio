// components/BlogPostWrapper.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogModal from "@/components/BlogModal";
import { BlogPost } from "@/components/BlogCard";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BlogPostWrapper = () => {
  const { id } = useParams<{ id: string }>(); // Changed from slug to id
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch by ID
        const response = await fetch(`${API_URL}/api/blog/${id}`);
        if (!response.ok) throw new Error('Post not found');

        const postData = await response.json();
        setPost(postData);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleClose = () => {
    navigate('/', { state: { scrollToBlog: true } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
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