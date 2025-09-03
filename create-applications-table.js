const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgyOTE1NywiZXhwIjoyMDcyNDA1MTU3fQ.oawfwNSSMZGpPnkrxE33pSUpP64My3-42k6sxey8TE8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createApplicationsTable() {
  console.log('Creating applications table...')
  
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('./scripts/005_create_applications.sql', 'utf8')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      console.error('Error executing SQL:', error)
      
      // Try alternative approach - execute statements individually
      console.log('Trying alternative approach...')
      
      // Create the applications table directly
      const createTableSQL = `
        create table if not exists public.applications (
          id uuid primary key default gen_random_uuid(),
          job_id uuid not null references public.jobs(id) on delete cascade,
          user_id uuid not null references public.profiles(id) on delete cascade,
          cover_letter text,
          resume_url text,
          portfolio_url text,
          additional_info text,
          status text not null default 'pending' check (status in ('pending', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn')),
          applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
          reviewed_by uuid references public.profiles(id),
          reviewed_at timestamp with time zone,
          notes text,
          unique(job_id, user_id)
        );
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
      
      if (createError) {
        console.error('Error creating table:', createError)
        return
      }
    }
    
    console.log('Applications table created successfully!')
    
    // Verify table exists
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .limit(1)
    
    if (fetchError) {
      console.error('Error verifying table:', fetchError)
    } else {
      console.log('Table verification successful!')
    }
    
  } catch (err) {
    console.error('Error:', err)
  }
}

createApplicationsTable()
