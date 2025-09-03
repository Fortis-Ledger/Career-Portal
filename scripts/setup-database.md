# Database Setup Guide

Follow these steps to set up your FortisLedger database in Supabase:

## Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one)

## Step 2: Open SQL Editor

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New query" to create a new SQL query

## Step 3: Run SQL Scripts in Order

Copy and paste each script one by one and run them in this exact order:

### Script 1: Create Profiles Table
Copy the content from `001_create_profiles.sql` and run it.

### Script 2: Create Companies Table  
Copy the content from `002_create_companies.sql` and run it.

### Script 3: Create Skills Table
Copy the content from `003_create_skills.sql` and run it.

### Script 4: Create Jobs Table
Copy the content from `004_create_jobs.sql` and run it.

### Script 5: Create Applications Table
Copy the content from `005_create_applications.sql` and run it.

### Script 6: Create Views and Functions
Copy the content from `006_create_views_and_functions.sql` and run it.

## Step 4: Verify Setup

1. Go to "Table Editor" in the left sidebar
2. You should see these tables:
   - `profiles`
   - `companies` 
   - `skills`
   - `jobs`
   - `applications`

## Step 5: Check RLS Policies

1. Click on each table
2. Go to "Policies" tab
3. Ensure Row Level Security is enabled
4. Verify that policies are created for each table

## Troubleshooting

### If you get permission errors:
- Make sure you're running the scripts as a superuser
- Check that your Supabase project has the correct permissions

### If tables don't appear:
- Refresh the page
- Check the SQL Editor for any error messages
- Ensure each script ran successfully before moving to the next

### If RLS policies fail:
- The policies are created automatically with the tables
- If they're missing, you can manually enable RLS and create policies

## Next Steps

After setting up the database:
1. Update your `.env.local` file with Supabase credentials
2. Restart your development server
3. Test the profile functionality

The profile form should now:
- Show existing data if a profile exists
- Create a new profile if none exists
- Update existing profiles without creating duplicates
