import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ManagePostForm({ post, manageKey }) {
  const navigate = useNavigate();
  
  const [name, setName] = useState(post.display_name);
  const [message, setMessage] = useState(post.message);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError('Message cannot be empty.');
      return;
    }
    if (trimmedMessage.length > 500) {
      setError('Message cannot exceed 500 characters.');
      return;
    }

    setIsUpdating(true);

    try {
      const displayName = name.trim() || 'Anonymous';

      const { error: supabaseError } = await supabase
        .from('posts')
        .update({
          display_name: displayName,
          message: trimmedMessage,
        })
        // As per schema prototype, we require manage_key to match for safety
        .eq('id', post.id)
        .eq('manage_key', manageKey);

      if (supabaseError) throw supabaseError;

      // Navigate back home on success
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to update post.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const { error: supabaseError } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
        .eq('manage_key', manageKey);

      if (supabaseError) throw supabaseError;

      // Navigate back home on success
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete post.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="manage-post-form">
      {error && <div className="error-message" role="alert">{error}</div>}
      
      {!showDeleteConfirm ? (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="editName">Name (optional)</label>
            <input
              type="text"
              id="editName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="editMessage">Message *</label>
            <textarea
              id="editMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              required
              rows={4}
            />
            <div className="character-count" aria-live="polite">
              {message.length} / 500
            </div>
          </div>

          <div className="button-group">
            <button type="submit" disabled={isUpdating} className="btn-primary">
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowDeleteConfirm(true)} 
              className="btn-danger"
            >
              Delete Post
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="delete-confirmation">
          <h3>Are you sure you want to delete this post?</h3>
          <p>This action cannot be undone.</p>
          <div className="button-group">
            <button 
              type="button" 
              onClick={handleDelete} 
              disabled={isDeleting} 
              className="btn-danger"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete Post'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowDeleteConfirm(false)} 
              disabled={isDeleting} 
              className="btn-secondary"
            >
              No, Keep Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
