# Supabase Migration Guide

This guide will help you migrate your S&T Motoring CRM from SQLite to Supabase (PostgreSQL cloud database).

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up for a free account
3. Create a new project:
   - Choose your organization
   - Enter project name: "S&T Motoring CRM"
   - Enter database password (save this securely!)
   - Choose a region close to you
   - Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

Create a `.env` file in your project root:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJ...your-anon-key-here
```

## Step 4: Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and paste it into the editor
3. Click **Run** to create all tables, indexes, and policies

## Step 5: Migrate Your Data

1. Make sure your current SQLite database (`crm.db`) is in the project root
2. Update the credentials in `migrate-to-supabase.js`:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Run the migration script:
   ```bash
   node migrate-to-supabase.js
   ```

## Step 6: Update Your Server

1. Update the credentials in `server-supabase.js`:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
   ```
2. Test the new server:
   ```bash
   node server-supabase.js
   ```

## Step 7: Update Your Frontend

No changes needed! Your frontend will work exactly the same since the API endpoints remain identical.

## Step 8: Deploy (Optional)

### Deploy Backend to Railway/Heroku:
1. Set environment variables in your hosting platform
2. Deploy the `server-supabase.js` file

### Deploy Frontend to Vercel/Netlify:
1. Build your React app: `npm run build`
2. Deploy the `client/build` folder

## Benefits of Supabase

- ✅ **Free tier**: 500MB database, 50MB file storage
- ✅ **Real-time**: Built-in real-time subscriptions
- ✅ **Authentication**: User management system
- ✅ **API**: Auto-generated REST and GraphQL APIs
- ✅ **Dashboard**: Web interface to manage your data
- ✅ **Backups**: Automatic daily backups
- ✅ **Scalability**: Easy to scale as your business grows

## Security Features

- Row Level Security (RLS) enabled
- API keys for secure access
- SSL/TLS encryption
- GDPR compliant

## Monitoring

- Check your Supabase dashboard for:
  - Database usage
  - API requests
  - Storage usage
  - Performance metrics

## Support

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Community: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

## Next Steps

After migration, consider:
1. Setting up user authentication
2. Adding real-time notifications
3. Implementing file storage for documents
4. Setting up automated backups
5. Adding database monitoring alerts
