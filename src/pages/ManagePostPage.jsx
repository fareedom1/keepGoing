import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ManagePostForm from '../components/ManagePostForm';

export default function ManagePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [key, setKey] = useState('');
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [keyError, setKeyError] = useState(null);
  
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // 1. Fetch post when page loads
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, display_name, message, manage_key')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        setFetchError('Post not found or could not be loaded.');
      } finally {
        setLoadingPost(false);
      }
    };
    
    fetchPost();
  }, [id]);

  // 2. Verify Key
  const handleVerifyKey = (e) => {
    e.preventDefault();
    setKeyError(null);
    setIsVerifying(true);
    
    // Simple client-side validation as requested for class prototype
    if (key.trim() === post.manage_key) {
      setIsKeyVerified(true);
    } else {
      setKeyError('Incorrect management key.');
    }
    
    setIsVerifying(false);
  };

  if (loadingPost) {
    return (
      <div className="container" style={{ marginTop: '3rem' }}>
        <div className="loading-state">Loading post details...</div>
      </div>
    );
  }

  if (fetchError || !post) {
    return (
      <div className="container" style={{ marginTop: '3rem' }}>
        <div className="error-message" role="alert">{fetchError || 'Post not found.'}</div>
        <button onClick={() => navigate('/')} className="btn-secondary">Return to Board</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      <h2>Manage Your Post</h2>
      
      {!isKeyVerified ? (
        <form className="manage-post-form" onSubmit={handleVerifyKey}>
          <p>Please enter your management key to edit or delete this post.</p>
          
          {keyError && <div className="error-message" role="alert">{keyError}</div>}
          
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label htmlFor="manageKey">Management Key</label>
            <input
              type="text"
              id="manageKey"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>
          
          <div className="button-group">
            <button type="submit" disabled={isVerifying || !key.trim()} className="btn-primary">
              Verify Key
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <ManagePostForm post={post} manageKey={key} />
      )}
    </div>
  );
}
