// Test script to debug job deletion
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgyOTE1NywiZXhwIjoyMDcyNDA1MTU3fQ.oawfwNSSMZGpPnkrxE33pSUpP64My3-42k6sxey8TE8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDelete() {
  console.log('Testing job deletion...')
  
  // First, let's see all jobs
  const { data: allJobs, error: allError } = await supabase
    .from('jobs')
    .select('id, title, is_active')
  
  if (allError) {
    console.error('Error fetching jobs:', allError)
    return
  }
  
  console.log('\n=== ALL JOBS IN DATABASE ===')
  allJobs.forEach(job => {
    console.log(`- ${job.title} (ID: ${job.id}, Active: ${job.is_active})`)
  })
  
  // Find Motion Graphics jobs
  const motionJobs = allJobs.filter(job => job.title.includes('Motion Graphics'))
  
  if (motionJobs.length > 0) {
    const jobToDelete = motionJobs[0]
    console.log(`\nAttempting to delete: ${jobToDelete.title} (ID: ${jobToDelete.id})`)
    
    // Try to delete the job
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobToDelete.id)
    
    if (deleteError) {
      console.error('Error deleting job:', deleteError)
      return
    }
    
    console.log('✅ Job deletion query executed successfully')
    
    // Check if job is actually deleted
    const { data: afterDelete, error: checkError } = await supabase
      .from('jobs')
      .select('id, title')
      .eq('id', jobToDelete.id)
    
    if (checkError) {
      console.error('Error checking deletion:', checkError)
      return
    }
    
    if (afterDelete && afterDelete.length === 0) {
      console.log('✅ Job successfully deleted from database')
    } else {
      console.log('❌ Job still exists in database:', afterDelete)
    }
    
    // Show remaining jobs
    const { data: remainingJobs } = await supabase
      .from('jobs')
      .select('id, title')
    
    console.log('\n=== REMAINING JOBS ===')
    remainingJobs?.forEach(job => {
      console.log(`- ${job.title} (ID: ${job.id})`)
    })
  } else {
    console.log('No Motion Graphics jobs found to delete')
  }
}

testDelete().catch(console.error)
