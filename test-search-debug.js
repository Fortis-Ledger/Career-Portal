// Test script to debug search functionality
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjkxNTcsImV4cCI6MjA3MjQwNTE1N30.S5tFj2ObP3N12jXTI-FSS9tWCmIRAH7VgLmSB2Hz8dg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSearch() {
  console.log('Testing search functionality...')
  
  // First, let's see all active jobs
  const { data: allJobs, error: allError } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      is_active,
      companies (name)
    `)
    .eq('is_active', true)
  
  if (allError) {
    console.error('Error fetching all jobs:', allError)
    return
  }
  
  console.log('\n=== ALL ACTIVE JOBS ===')
  allJobs.forEach(job => {
    console.log(`- ${job.title} (Company: ${job.companies?.name || 'N/A'})`)
  })
  
  // Test search for "M"
  const { data: mJobs, error: mError } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      companies (name)
    `)
    .eq('is_active', true)
    .or('title.ilike.%M%,companies.name.ilike.%M%')
  
  if (mError) {
    console.error('Error searching for M:', mError)
    return
  }
  
  console.log('\n=== JOBS MATCHING "M" ===')
  if (mJobs.length === 0) {
    console.log('No jobs found matching "M"')
  } else {
    mJobs.forEach(job => {
      console.log(`- ${job.title} (Company: ${job.companies?.name || 'N/A'})`)
    })
  }
  
  // Test search for "motion"
  const { data: motionJobs, error: motionError } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      companies (name)
    `)
    .eq('is_active', true)
    .or('title.ilike.%motion%,companies.name.ilike.%motion%')
  
  if (motionError) {
    console.error('Error searching for motion:', motionError)
    return
  }
  
  console.log('\n=== JOBS MATCHING "motion" ===')
  if (motionJobs.length === 0) {
    console.log('No jobs found matching "motion"')
  } else {
    motionJobs.forEach(job => {
      console.log(`- ${job.title} (Company: ${job.companies?.name || 'N/A'})`)
    })
  }
}

testSearch().catch(console.error)
