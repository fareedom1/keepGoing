import { useState } from 'react';
import CreatePostForm from '../components/CreatePostForm';
import PostFeed from '../components/PostFeed';

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="home-page container">
      
      <section className="feed-section">
        <h2>Notes from the community</h2>
        <PostFeed />
      </section>

      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsFormOpen(false)} aria-label="Close form">✕</button>
            <h2 className="modal-title">Leave a note for someone who needs it</h2>
            <CreatePostForm />
          </div>
        </div>
      )}

      <button 
        className="fab-button" 
        onClick={() => setIsFormOpen(true)}
        title="Share encouragement"
        aria-label="Add a post"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>

    </div>
  );
}
