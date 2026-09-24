import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const { id, created_at, updated_at, display_name, message } = post;
  
  const createdDate = new Date(created_at);
  const updatedDate = new Date(updated_at);
  
  // Consider edited if updated_at is at least 2 seconds after created_at
  const isEdited = updatedDate.getTime() - createdDate.getTime() > 2000;
  
  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-name">{display_name}</div>
        <div className="post-meta">
          <time dateTime={created_at}>
            {createdDate.toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </time>
          {isEdited && <span className="edited-badge">Edited</span>}
        </div>
      </header>
      
      <div className="post-message">
        {message}
      </div>
      
      <footer className="post-actions">
        <Link to={`/manage/${id}`} className="manage-link">Manage this post</Link>
      </footer>
    </article>
  );
}
