// Simple script to create a test Motion Graphics job
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgyOTE1NywiZXhwIjoyMDcyNDA1MTU3fQ.oawfwNSSMZGpPnkrxE33pSUpP64My3-42k6sxey8TE8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestJob() {
  console.log('Creating test Motion Graphics job...')
  
  // First check if we have any companies
  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')
    .limit(1)
  
  let companyId
  if (companies && companies.length > 0) {
    companyId = companies[0].id
    console.log(`Using existing company: ${companies[0].name}`)
  } else {
    // Create a test company
    const { data: newCompany, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Creative Studio Inc',
        industry: 'Design',
        location: 'New York, NY',
        is_active: true
      })
      .select()
      .single()
    
    if (companyError) {
      console.error('Error creating company:', companyError)
      return
    }
    
    companyId = newCompany.id
    console.log('Created test company: Creative Studio Inc')
  }
  
  // Create the Motion Graphics job
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert({
      title: 'Motion Graphics Designer',
      description: 'We are looking for a talented Motion Graphics Designer to create engaging visual content for our digital marketing campaigns.',
      company_id: companyId,
      employment_type: 'full-time',
      experience_level: 'mid',
      salary_min: 50000,
      salary_max: 70000,
      is_remote: false,
      is_active: true,
      is_featured: true,
      location: 'New York, NY'
    })
    .select()
  
  if (jobError) {
    console.error('Error creating job:', jobError)
    return
  }
  
  console.log('✅ Successfully created Motion Graphics Designer job!')
  console.log('Job ID:', job[0].id)
  
  // Test the search
  console.log('\nTesting search for "M"...')
  const { data: searchResults } = await supabase
    .from('jobs')
    .select(`
      title,
      companies (name)
    `)
    .eq('is_active', true)
    .or('title.ilike.%M%,companies.name.ilike.%M%')
  
  console.log('Search results:', searchResults?.map(j => j.title))
}

createTestJob().catch(console.error)
