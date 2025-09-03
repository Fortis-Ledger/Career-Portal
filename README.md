# FortisLedger

A modern job application and management platform built with Next.js, Supabase, and Tailwind CSS.

## Features

- User authentication and profile management
- Job browsing and application system
- Admin dashboard with analytics
- Modern, responsive UI

## Database Setup

Before running the application, you need to set up the database tables. The SQL scripts are located in the `scripts/` folder.

### Required Tables

1. **profiles** - User profile information (including profile pictures)
2. **companies** - Company information
3. **skills** - Skills database
4. **jobs** - Job listings
5. **applications** - Job applications

### Running SQL Scripts

You need to run these SQL scripts in your Supabase database in the following order:

1. `001_create_profiles.sql` - Creates user profiles table with image support
2. `002_create_companies.sql` - Creates companies table
3. `003_create_skills.sql` - Creates skills table
4. `004_create_jobs.sql` - Creates jobs table
5. `005_create_applications.sql` - Creates applications table
6. `006_create_views_and_functions.sql` - Creates views and functions
7. `007_create_storage.sql` - Creates storage buckets for profile images

### Storage Setup for Profile Pictures

The application now supports profile pictures and cover images. After running the SQL scripts:

1. **Go to Storage** in your Supabase dashboard
2. **Verify buckets exist**: `profile-pictures` and `cover-images`
3. **Check RLS policies** are properly configured
4. **Test image upload** functionality

### How to Run

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste each script content
4. Run them in order
5. Check Storage section for image buckets

## Profile Issues Troubleshooting

If you're experiencing issues with profiles not showing saved data or creating duplicates:

### Common Issues

1. **Profile not found**: The database trigger might not have created a profile automatically
2. **Empty form fields**: The form might not be properly initialized with existing data
3. **Duplicate entries**: The upsert operation might not be working correctly

### Solutions

1. **Check database connection**: Open browser console and look for database connection messages
2. **Verify profile exists**: Check if a profile row exists in your Supabase profiles table
3. **Manual profile creation**: If no profile exists, fill out the form and click "Create Profile"
4. **Check RLS policies**: Ensure Row Level Security policies are properly configured

### Debug Information

The profile form includes debug information in development mode that shows:
- User ID and email
- Whether profile exists
- Current form data
- Raw profile data from database

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
