import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function CreatePostForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
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

    setIsSubmitting(true);

    try {
      // Generate a random management key
      const manageKey = crypto.randomUUID();
      const displayName = name.trim() || 'Anonymous';

      const { data, error: supabaseError } = await supabase
        .from('posts')
        .insert([
          {
            display_name: displayName,
            message: trimmedMessage,
            manage_key: manageKey,
          },
        ])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      // Handle success
      setSuccessData({
        id: data.id,
        manageKey: manageKey,
      });
      setName('');
      setMessage('');
      
      // Dispatch custom event to trigger feed refresh
      window.dispatchEvent(new Event('postCreated'));

    } catch (err) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = async () => {
    if (successData?.manageKey) {
      try {
        await navigator.clipboard.writeText(successData.manageKey);
        alert('Management key copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy key:', err);
      }
    }
  };

  if (successData) {
    return (
      <div className="success-dialog">
        <h3>Post Created Successfully!</h3>
        <div className="alert-warning">
          <strong>Save this key now. You will need it to edit or delete your post, and it will not be shown again.</strong>
        </div>
        <div className="key-display">
          <code>{successData.manageKey}</code>
          <button type="button" onClick={handleCopyKey} className="btn-secondary">Copy Key</button>
        </div>
        <div className="success-actions">
          <button type="button" onClick={() => setSuccessData(null)} className="btn-primary">Share Another</button>
          <Link to={`/manage/${successData.id}`} className="btn-secondary">Manage this post</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <p className="privacy-notice">Posts are public. Please do not share sensitive personal information.</p>
      
      {error && <div className="error-message" role="alert">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Name (optional)</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Anonymous"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share something encouraging..."
          maxLength={500}
          required
          rows={4}
        />
        <div className="character-count" aria-live="polite">
          {message.length} / 500
        </div>
      </div>

      <button type="submit" disabled={isSubmitting || !message.trim()} className="btn-primary">
        {isSubmitting ? 'Sharing...' : 'Share a Kind Word'}
      </button>
    </form>
  );
}
