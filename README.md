# Keep Going
**Live Application URL:** https://keep-going-jet.vercel.app
> **Leave a spark. Take a spark. We're all in this together.**

Welcome to **Keep Going**, a collective journal of human resilience and a public encouragement board. In a world that can sometimes feel overwhelming, this space was created to remind us that we are not walking through the storm alone.

## What is this place?

*Keep Going* is a digital community board where visitors from around the world can leave short notes of encouragement, affirmations, and kind words. 

Whether you are having a hard day and need to read something uplifting, or you've just made it through a tough time and want to leave a note for someone else—this space is for you.

## Features & How it Works

- **Read:** Simply scroll through the "Notes from the community" feed on the main page to read words left by fellow travelers.
- **Share:** Click the floating plus button in the bottom corner to leave your own spark. You can use your name, a pseudonym, or remain completely anonymous.
- **Manage:** When you leave a note, you'll be given a one-time secret key. Keep this key safe! You can use it later if you ever want to edit or remove your message at `/manage/:id`.

## Technology Stack

- **Frontend:** React, Vite, React Router
- **Backend / Database:** Supabase (PostgreSQL)
- **Styling:** Custom CSS with vibrant glassmorphism aesthetics

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



**Demo Video URL:** (https://youtu.be/7Q5EKN-ywew)


## Community Guidelines & Privacy Limitations

Because this is an open public space, we ask that you respect the spirit of the board:
- Be kind, gentle, and encouraging.
- **Do not share sensitive, private, health-related, or personally identifying information.**
- Treat this space as a quiet room meant for reflection and support.

**Important Security & Privacy Notices:**
- **Public Visibility:** All posts are entirely public.
- **Not a Support Service:** Keep Going is a public encouragement board, not a crisis, medical, or mental-health support service. If you are experiencing a crisis, please reach out to professional support services in your area.
- **Educational Prototype Security:** This project was originally built as a prototype. The per-post management key is a simplified educational feature. Database policies are intentionally permissive to allow for a seamless, account-free experience. A real product should hash secrets and enforce authorization server-side or with authenticated user ownership.

---
*Built with care to keep us all moving forward.*
