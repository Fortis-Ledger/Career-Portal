const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgyOTE1NywiZXhwIjoyMDcyNDA1MTU3fQ.oawfwNSSMZGpPnkrxE33pSUpP64My3-42k6sxey8TE8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAdminApplications() {
  console.log('=== TESTING ADMIN APPLICATIONS FETCH ===')
  
  try {
    // First, let's check the applications table directly
    console.log('\n1. Direct applications table query:')
    const { data: directApps, error: directError } = await supabase
      .from('applications')
      .select('*')
    
    if (directError) {
      console.error('Direct query error:', directError)
    } else {
      console.log('Direct applications count:', directApps?.length)
      console.log('Direct applications:', directApps)
    }
    
    // Now let's test the admin query with joins
    console.log('\n2. Admin query with joins (same as admin page):')
    const { data: adminApps, error: adminError } = await supabase
      .from('applications')
      .select(`
        *,
        profiles:user_id (id, full_name, email, phone, location),
        jobs:job_id (id, title, company_name, employment_type)
      `)
      .order('applied_at', { ascending: false })
    
    if (adminError) {
      console.error('Admin query error:', adminError)
    } else {
      console.log('Admin applications count:', adminApps?.length)
      console.log('Admin applications:', adminApps)
    }
    
    // Let's check if the related tables exist and have data
    console.log('\n3. Checking related tables:')
    
    // Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
    
    if (profilesError) {
      console.error('Profiles query error:', profilesError)
    } else {
      console.log('Profiles count:', profiles?.length)
      if (profiles && profiles.length > 0) {
        console.log('Sample profile:', profiles[0])
      }
    }
    
    // Check jobs table
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
    
    if (jobsError) {
      console.error('Jobs query error:', jobsError)
    } else {
      console.log('Jobs count:', jobs?.length)
      if (jobs && jobs.length > 0) {
        console.log('Sample job:', jobs[0])
      }
    }
    
    // Let's check the specific application's related data
    if (directApps && directApps.length > 0) {
      const app = directApps[0]
      console.log('\n4. Checking specific application relationships:')
      console.log('Application:', app)
      
      // Check if the user_id exists in profiles
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', app.user_id)
        .single()
      
      if (userError) {
        console.error('User profile error:', userError)
      } else {
        console.log('User profile:', userProfile)
      }
      
      // Check if the job_id exists in jobs
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', app.job_id)
        .single()
      
      if (jobError) {
        console.error('Job data error:', jobError)
      } else {
        console.log('Job data:', jobData)
      }
    }
    
  } catch (err) {
    console.error('Error:', err)
  }
}

testAdminApplications()
