const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjkxNTcsImV4cCI6MjA3MjQwNTE1N30.S5tFj2ObP3N12jXTI-FSS9tWCmIRAH7VgLmSB2Hz8dg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugApplications() {
  console.log('=== DEBUGGING APPLICATIONS TABLE ===')
  
  // Check if applications table exists
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'applications')
  
  console.log('Applications table exists:', tables?.length > 0)
  if (tablesError) console.error('Error checking table:', tablesError)
  
  // Check table structure
  const { data: columns, error: columnsError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type')
    .eq('table_schema', 'public')
    .eq('table_name', 'applications')
  
  console.log('Table columns:', columns)
  if (columnsError) console.error('Error checking columns:', columnsError)
  
  // Check row count
  const { count, error: countError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
  
  console.log('Total applications count:', count)
  if (countError) console.error('Error counting applications:', countError)
  
  // Try to fetch all applications
  const { data: applications, error: fetchError } = await supabase
    .from('applications')
    .select('*')
  
  console.log('Applications data:', applications)
  console.log('Applications count from data:', applications?.length)
  if (fetchError) console.error('Error fetching applications:', fetchError)
  
  // Check RLS policies
  const { data: policies, error: policiesError } = await supabase
    .rpc('get_policies', { schema_name: 'public', table_name: 'applications' })
    .catch(() => {
      console.log('RPC get_policies not available, checking manually...')
      return { data: null, error: null }
    })
  
  if (policies) {
    console.log('RLS Policies:', policies)
  }
  if (policiesError) console.error('Error checking policies:', policiesError)
}

debugApplications().catch(console.error)
