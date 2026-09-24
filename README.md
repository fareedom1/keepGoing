# Keep Going

A place to share the words that help us keep going. This is a public encouragement board where visitors can share short motivational messages, affirmations, and words that help others keep moving forward.

## Features

- **Create Posts:** Share a short encouraging message (up to 500 characters). Optionally provide a name, otherwise posts appear as "Anonymous".
- **Public Feed:** View all words of encouragement shared by the community in reverse chronological order.
- **Manage Posts:** When creating a post, you receive a one-time management key. Use this key to update or delete your own post later.

## Technology Stack

- **Frontend:** React, Vite, React Router
- **Backend/Database:** Supabase (PostgreSQL)
- **Styling:** CSS
- **Deployment:** Netlify (recommended)

## CRUD Operations

| Operation | Implementation Details |
|---|---|
| **Create** | Visitor enters an optional name and required message, submitted to Supabase. A management key is generated locally and saved with the post. |
| **Read** | The public board loads and displays posts from newest to oldest. |
| **Update** | Original creator opens the management route (`/manage/:id`), enters the correct secret management key, and edits their name/message. |
| **Delete** | Original creator enters the correct key, confirms deletion, and removes their post from the database. |

## Project Structure

```text
src/
  components/
    Header.jsx
    CreatePostForm.jsx
    PostFeed.jsx
    PostCard.jsx
    SuccessKeyModal.jsx
    ManagePostForm.jsx
    Footer.jsx
  pages/
    HomePage.jsx
    ManagePostPage.jsx
  lib/
    supabaseClient.js
  App.jsx
  main.jsx
  index.css
supabase/
  schema.sql
.env.example
README.md
```

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd keep-going
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a Supabase project:**
   Sign up at [Supabase](https://supabase.com) and create a new project.
4. **Setup the Database:**
   Go to the Supabase SQL Editor and run the contents of `supabase/schema.sql`. This file includes table creation, triggers, Row Level Security (RLS) enablement, and public prototype policies.
5. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase project URL and publishable key to `.env.local`. *(Note: For projects using a legacy anon key, you can replace `VITE_SUPABASE_PUBLISHABLE_KEY` with `VITE_SUPABASE_ANON_KEY`)*
6. **Run the local development server:**
   ```bash
   npm run dev
   ```

## Deployment (Netlify)

1. Connect your repository to Netlify.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. Add your two Vite Supabase environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`) in the Netlify dashboard under Site Settings > Environment Variables.
5. Deploy the site.

**Live Application URL:** [Add your deployed URL here]
**Demo Video URL:** [Add your unlisted YouTube demo URL here]

## Security and Privacy Limitations

- Posts are public.
- Visitors must not share personally identifying, sensitive, health, or crisis-related information.
- Keep Going is not a crisis, medical, or mental-health support service.
- The per-post management key is a simplified educational prototype.
- The database policies are intentionally permissive to make CRUD work without accounts.
- A real product should hash secrets and enforce authorization server-side or with authenticated user ownership.

## Testing Checklist

- [ ] Create a post with a name and message. Verify it appears on the public board.
- [ ] Create a post without a name. Verify it displays as "Anonymous".
- [ ] Check that a blank or whitespace-only message cannot be submitted.
- [ ] Check that the success dialog displays the management key and the "Copy Key" functionality works.
- [ ] Verify that public post cards do not display the management key.
- [ ] Navigate to the management page for a post. Verify that a wrong key does not expose edit/delete controls.
- [ ] Enter the correct key. Verify that editing changes the post in Supabase and the updated state appears on the board.
- [ ] Delete a post. Verify that it requires confirmation, is removed from Supabase, and no longer appears on the public board.
