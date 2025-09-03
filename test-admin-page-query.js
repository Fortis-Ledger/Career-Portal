const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgyOTE1NywiZXhwIjoyMDcyNDA1MTU3fQ.oawfwNSSMZGpPnkrxE33pSUpP64My3-42k6sxey8TE8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAdminPageQuery() {
  console.log('=== TESTING ADMIN PAGE QUERY LOGIC ===')
  
  try {
    // Test the exact logic from admin applications page
    console.log('\n1. Testing admin applications page logic:')
    
    // First get applications
    const { data: applications, error: applicationsError } = await supabase
      .from("applications")
      .select("*")
      .order("applied_at", { ascending: false })

    if (applicationsError) {
      console.error("Error fetching applications:", applicationsError)
      return
    }

    console.log("Applications fetched:", applications?.length)
    console.log("Applications:", applications)

    // Then get related data separately
    let applicationsWithDetails = []
    
    if (applications && applications.length > 0) {
      // Get unique user IDs and job IDs
      const userIds = [...new Set(applications.map(app => app.user_id))]
      const jobIds = [...new Set(applications.map(app => app.job_id))]
      
      console.log("Unique user IDs:", userIds)
      console.log("Unique job IDs:", jobIds)
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, location")
        .in("id", userIds)
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError)
      } else {
        console.log("Profiles fetched:", profiles?.length)
        console.log("Profiles:", profiles)
      }
      
      // Fetch jobs with company information
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select(`
          id, 
          title, 
          employment_type,
          companies!inner (id, name)
        `)
        .in("id", jobIds)
      
      if (jobsError) {
        console.error("Error fetching jobs:", jobsError)
      } else {
        console.log("Jobs fetched:", jobs?.length)
        console.log("Jobs:", jobs)
      }
      
      // Combine the data
      applicationsWithDetails = applications.map(app => ({
        ...app,
        profiles: profiles?.find(p => p.id === app.user_id) || null,
        jobs: jobs?.find(j => j.id === app.job_id) || null
      }))
      
      console.log("\nFinal combined applications:")
      console.log(applicationsWithDetails)
    }
    
  } catch (err) {
    console.error('Error:', err)
  }
}

testAdminPageQuery()
