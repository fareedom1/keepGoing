import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PostCard from './PostCard';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('posts')
        .select('id, created_at, updated_at, display_name, message')
        .order('created_at', { ascending: false });
        
      if (supabaseError) throw supabaseError;
      
      setPosts(data || []);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Listen for new posts created in this session
    const handleNewPost = () => {
      fetchPosts();
    };

    window.addEventListener('postCreated', handleNewPost);
    return () => window.removeEventListener('postCreated', handleNewPost);
  }, []);

  if (loading) {
    return <div className="loading-state">Loading encouraging words...</div>;
  }

  if (error) {
    return <div className="error-message" role="alert">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>No words here yet. Be the first to leave someone a reason to keep going.</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
