// Simple test to verify search works
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjkxNTcsImV4cCI6MjA3MjQwNTE1N30.S5tFj2ObP3N12jXTI-FSS9tWCmIRAH7VgLmSB2Hz8dg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSearch() {
  console.log('Testing search...')
  
  // Test 1: Get all jobs
  const { data: allJobs, error: allError } = await supabase
    .from('jobs')
    .select('title, is_active')
    .eq('is_active', true)
  
  console.log('All active jobs:', allJobs?.map(j => j.title))
  
  // Test 2: Search for "M" using individual filters
  const { data: mJobs, error: mError } = await supabase
    .from('jobs')
    .select('title')
    .eq('is_active', true)
    .ilike('title', '%M%')
  
  console.log('Jobs with "M" in title:', mJobs?.map(j => j.title))
  
  // Test 3: Search for "motion"
  const { data: motionJobs, error: motionError } = await supabase
    .from('jobs')
    .select('title')
    .eq('is_active', true)
    .ilike('title', '%motion%')
  
  console.log('Jobs with "motion" in title:', motionJobs?.map(j => j.title))
}

testSearch().catch(console.error)
