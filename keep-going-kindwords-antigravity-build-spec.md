# Keep Going — Complete Build Specification

## Goal

Build a complete, polished web application named **Keep Going**.

**Keep Going** is a public encouragement board where visitors can share short motivational messages, affirmations, and words that help others keep moving forward. Visitors may post under a name or leave the name blank to appear as **Anonymous**. No account creation or login is used.

When a visitor creates a post, the app gives them a one-time private management key. They can use that key later to edit or delete only their own post.

The target is a fully working class-project application with React, Vite, Supabase, CRUD functionality, documentation, and a clean Git history. Complete as much as possible independently; only stop to ask me for the **two Supabase client credentials** needed to connect to my project.

## Brand and Copy

Use the following brand identity consistently:

- App name: **Keep Going**
- Primary tagline: **“A place to share the words that help us keep going.”**
- Create-post heading: **“Share a little encouragement”**
- Public-board heading: **“Words to keep you going”**
- Empty-state message: **“No words here yet. Be the first to leave someone a reason to keep going.”**
- Footer disclaimer: **“Keep Going is a public encouragement board, not a crisis, medical, or mental-health support service.”**

Avoid clinical language and do not claim therapy, counseling, medical advice, private messaging, confidentiality, moderation, or crisis support.

## Required Stack

- React
- Vite
- JavaScript (not TypeScript unless the existing project already uses TypeScript)
- `@supabase/supabase-js`
- Supabase Postgres database
- React Router for the management route
- Plain CSS or CSS modules; do not add a heavyweight UI framework

Keep dependencies minimal.

## What You Must Build

Build the application completely, including the frontend, SQL/schema files, Supabase integration code, environment-variable templates, README, and logical Git commits.

Do not wait for Supabase credentials before building the project. Build the UI and all integration code using environment-variable placeholders. When the project needs live data verification, ask me only for:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

If this Supabase project uses a legacy anonymous key instead of a publishable key, accept this alternative variable name only when needed:

```text
VITE_SUPABASE_ANON_KEY
```

Never ask for or use a Supabase `service_role` key. Never place credentials in source code, commit them to Git, write them in the README, or include them in `.env.example`.

## Supabase Setup Strategy

### When Supabase credentials are not yet available

1. Create the entire React app and all components.
2. Add `src/lib/supabaseClient.js`, using Vite environment variables.
3. Add `supabase/schema.sql` containing the complete database setup.
4. Add `.env.example` with variable names only.
5. Add clear README instructions for creating a Supabase project and running the SQL in the Supabase SQL Editor.
6. Use mock/sample data only as a temporary development fallback if necessary, and keep it clearly separated from production Supabase data.
7. Do not claim that a live Supabase table was created or tested until credentials and project access are provided.

### Once I provide credentials

1. Tell me exactly where to place them locally, preferably in `.env.local`.
2. Use them only through environment variables.
3. Ask me to run `supabase/schema.sql` in the Supabase project SQL Editor if you cannot directly access the Supabase dashboard.
4. After I confirm the SQL has run, connect the app and verify create, read, update, and delete operations against the live `posts` table.
5. Do not modify the project to include any secret/server-only key.

Supabase’s client-side React setup uses a project URL plus a public/publishable project key. Use the currently recommended names `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.example`, and support `VITE_SUPABASE_ANON_KEY` only as a documented backward-compatible fallback if necessary.

## Database Schema

Create this file:

```text
supabase/schema.sql
```

It must contain SQL that creates the `public.posts` table and all required public prototype policies.

Use this data model:

```sql
create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text not null default 'Anonymous',
  message text not null check (char_length(trim(message)) between 1 and 500),
  manage_key text not null
);
```

Add an `updated_at` trigger function and trigger so `updated_at` automatically changes on every update.

Enable Row Level Security and add public prototype policies needed to allow the deployed client app to:

- Select posts for the public feed.
- Insert a new post.
- Update a post for the management-key workflow.
- Delete a post for the management-key workflow.

Document at the top of `schema.sql` that these broad policies are intentionally for a classroom prototype and are **not suitable for a production public app**.

### Required security/privacy limitations

This is intentionally the simple class-project version:

- Store `manage_key` directly in the table.
- Do not display `manage_key` in a post card or normal public-feed UI.
- Use the key to control the UI management flow.
- Make it clear in the README that public client-side CRUD policies and plaintext management keys are insecure for a real public app.
- Explain that a real app should hash secrets and enforce authorization server-side through authentication, an Edge Function, or a database function.

Do not make false claims that this implementation provides real security or private/confidential posting.

## Environment Files

Create `.env.example` with exactly:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Add a comment to the README explaining that projects using a legacy anon key can replace `VITE_SUPABASE_PUBLISHABLE_KEY` with `VITE_SUPABASE_ANON_KEY`, and the Supabase client helper should support either variable.

Ensure `.env`, `.env.local`, and other local environment files are gitignored. Never commit them.

## Required CRUD Features

The application must fully demonstrate CRUD:

| Operation | Required Keep Going behavior |
|---|---|
| Create | Visitor enters an optional name and required encouraging message, then submits it to Supabase. |
| Read | The public board loads and displays posts from newest to oldest. |
| Update | Original creator opens the management route, enters the correct secret management key, and edits their own name/message. |
| Delete | Original creator enters the correct key, confirms deletion, and removes their post. |

## Create-Post Experience

Build a create-post form on the home page with:

- Optional `Name` text input.
  - If blank, save `Anonymous` as `display_name`.
  - Do not add an anonymous toggle.
- Required `Message` textarea.
  - Limit to 500 characters.
  - Display an accessible live character count.
  - Reject blank/whitespace-only messages.
- Button label: `Share a Kind Word` or `Share Encouragement`.
- Clear loading state while submitting.
- Clear validation and Supabase error messages.

When a post is created:

1. Generate a random, hard-to-guess management key on the client.
2. Save the `display_name`, `message`, and `manage_key` to Supabase.
3. Show a success modal/dialog immediately after successful creation.
4. The dialog must display the raw management key prominently exactly when created.
5. Include this warning: **“Save this key now. You will need it to edit or delete your post, and it will not be shown again.”**
6. Include a Copy Key button using the Clipboard API, with feedback when copied.
7. Include a direct button/link to the management page for that new post.
8. Refresh the public feed.

Generate the key using `crypto.randomUUID()` when available, with a reasonable secure random fallback if needed. Do not use predictable IDs, timestamps alone, or a simple incrementing number as the key.

## Public Feed

Build a responsive public feed that:

- Fetches posts from Supabase.
- Sorts posts descending by `created_at`.
- Handles loading, empty, and error states.
- Shows each post in a readable card.

Each post card must show:

- Display name.
- Message.
- Human-readable creation date/time.
- An `Edited` label only when `updated_at` is meaningfully later than `created_at`.
- A `Manage this post` link that routes to `/manage/:id`.

Never render the management key in a post card, visible public feed markup, or normal on-screen text.

## Manage-Post Flow

Use React Router and create this route:

```text
/manage/:id
```

The management page must:

1. Fetch the post associated with the route ID.
2. Show a key-entry form before displaying editable content.
3. Require a visitor to enter the management key.
4. Compare the entered key with the retrieved post’s `manage_key` for this simple classroom prototype.
5. If the post does not exist or the key is wrong, show a clear generic error message and do not reveal editable controls.
6. When the key is correct, show an edit form populated with the post’s name and message.
7. Apply the same validations as creation.
8. Save updates to Supabase and show a success status.
9. Include a Delete Post action.
10. Require an explicit confirmation dialog/step before deletion.
11. After successful deletion, navigate back to the home page and ensure the deleted post no longer appears.
12. Include a way to return to the public board without making changes.

Do not call this approach “protected” in a security sense. It is a simple ownership-like convenience flow for a course prototype.

## Design Requirements

Create a calm, encouraging, polished but not over-designed interface.

- Use warm, hopeful colors such as cream/off-white, soft blue, muted purple, gentle green, or warm coral accents.
- Maintain readable contrast and visible keyboard focus states.
- Make forms and buttons accessible with real labels.
- Support mobile and desktop layouts.
- Use semantic HTML where appropriate.
- Keep typography and spacing consistent.
- Avoid images unless they materially improve the experience.
- No dark-pattern privacy wording. Posts are public, so clearly say that near the form.

## Recommended Project Structure

Use this structure or an equally clear equivalent:

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

Keep responsibilities separated. Do not place all logic and UI in a single giant `App.jsx` file.

## README Requirements

Create a complete, well-written `README.md` containing:

1. Project title and description.
2. Feature list.
3. Technology stack.
4. Clear CRUD mapping table.
5. Project structure overview.
6. Local setup instructions:
   - Clone the repository.
   - Install dependencies.
   - Create a Supabase project.
   - Run `supabase/schema.sql` in the Supabase SQL Editor.
   - Copy `.env.example` to `.env.local`.
   - Add project URL and publishable key.
   - Run the local development server.
7. Supabase setup section explaining that the SQL file includes table, trigger, RLS, and prototype policies.
8. Deployment instructions for Netlify:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Set the two Vite Supabase environment variables in Netlify.
9. Placeholder for deployed application URL.
10. Placeholder for unlisted YouTube demo URL.
11. Security and privacy limitations section stating all of the following:
   - Posts are public.
   - Visitors must not share personally identifying, sensitive, health, or crisis-related information.
   - Keep Going is not a crisis, medical, or mental-health support service.
   - The per-post management key is a simplified educational prototype.
   - The database policies are intentionally permissive to make CRUD work without accounts.
   - A real product should hash secrets and enforce authorization server-side or with authenticated user ownership.
12. A short testing checklist for create, read, update, and delete.

## Git Workflow: Multiple Required Commits

Do not place all work in one large commit. Implement, verify, then commit each milestone separately. Use `git status` before every commit. Do not commit `node_modules`, `dist`, `.env`, `.env.local`, or credentials.

Create logical commits similar to the following. Use these exact messages where they accurately describe the work:

1. `chore: initialize Keep Going React project`
   - Initialize Vite/React, package dependencies, `.gitignore`, base folder structure.

2. `docs: add Keep Going project plan and environment template`
   - Add initial README, `.env.example`, and design/project notes.

3. `feat: add Supabase client and database schema`
   - Add `supabaseClient.js`, `supabase/schema.sql`, and associated setup documentation.

4. `feat: build encouragement post creation form`
   - Implement name fallback, message validation, character count, and create behavior.

5. `feat: add public encouragement feed`
   - Implement Supabase read behavior plus loading, empty, and error states.

6. `feat: add one-time management key dialog`
   - Generate, display, and copy the key after successfully creating a post.

7. `feat: add key-based post editing`
   - Add route, key verification UI, and update behavior.

8. `feat: add post deletion confirmation flow`
   - Add delete confirmation and deletion behavior.

9. `style: polish responsive Keep Going interface`
   - Improve visual design, responsiveness, focus styles, and accessibility.

10. `docs: finalize setup deployment and limitations`
    - Complete README deployment, testing, privacy, and security details.

If a milestone needs more than one commit, make smaller meaningful commits rather than skipping the intended organization. Push the commits to the configured public GitHub remote as progress is made.

## Completion and Verification

Before declaring the project complete, confirm all of the following:

- The app builds successfully with `npm run build`.
- No real credentials are in the repository.
- `.env.local` is ignored by Git.
- The app uses environment variables, not hard-coded Supabase URL/key values.
- Empty names display as `Anonymous`.
- Empty or whitespace-only messages cannot be submitted.
- Messages are limited to 500 characters.
- A created post appears in the live Supabase-backed public feed.
- The success dialog displays the management key once and Copy Key works.
- Public post cards do not display the management key.
- A wrong key does not expose edit/delete controls.
- A correct key permits editing only for the requested post.
- Editing changes the post in Supabase and displays the edited state.
- Deletion requires confirmation, removes the post, and returns to the board.
- The UI remains usable on phone and desktop widths.
- The README is accurate, complete, and includes the prototype security/privacy limitations.
- Git history shows multiple meaningful commits, not one catch-all commit.

## Final Handoff Format

When finished, provide a concise report containing:

1. Features completed.
2. The exact credentials still needed, if any, using variable names only.
3. Exact steps for me to create a Supabase project and run `supabase/schema.sql` if you could not do so directly.
4. Exact local commands to install and run the app.
5. Any Netlify deployment steps remaining.
6. A short manual test checklist for my demo recording.
7. The list of Git commits created.
