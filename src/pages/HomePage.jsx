import CreatePostForm from '../components/CreatePostForm';
// import PostFeed from '../components/PostFeed';

export default function HomePage() {
  return (
    <div className="home-page container">
      <section className="create-section">
        <h2>Share a little encouragement</h2>
        <CreatePostForm />
      </section>
      
      <section className="feed-section">
        <h2>Words to keep you going</h2>
        {/* <PostFeed /> */}
      </section>
    </div>
  );
}
