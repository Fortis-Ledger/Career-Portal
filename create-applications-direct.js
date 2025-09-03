const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://samxmwiyhkencakujwgb.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgyOTE1NywiZXhwIjoyMDcyNDA1MTU3fQ.oawfwNSSMZGpPnkrxE33pSUpP64My3-42k6sxey8TE8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createApplicationsTableDirect() {
  console.log('Creating applications table directly...')
  
  try {
    // First, let's check if the table already exists by trying to select from it
    const { data: existingData, error: existingError } = await supabase
      .from('applications')
      .select('*')
      .limit(1)
    
    if (existingData !== null) {
      console.log('Applications table already exists!')
      
      // Check if there are any applications
      const { count, error: countError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.error('Error counting applications:', countError)
      } else {
        console.log('Total applications in table:', count)
      }
      
      // Show existing applications
      const { data: applications, error: fetchError } = await supabase
        .from('applications')
        .select('*')
      
      if (fetchError) {
        console.error('Error fetching applications:', fetchError)
      } else {
        console.log('Existing applications:', applications)
      }
      
      return
    }
    
    console.log('Table does not exist, creating it...')
    
    // Since we can't use exec_sql, let's try to create the table using the Supabase dashboard
    console.log('\n=== MANUAL STEPS REQUIRED ===')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Run the following SQL:')
    console.log('\n-- Create applications table')
    console.log('CREATE TABLE IF NOT EXISTS public.applications (')
    console.log('  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),')
    console.log('  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,')
    console.log('  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,')
    console.log('  cover_letter text,')
    console.log('  resume_url text,')
    console.log('  portfolio_url text,')
    console.log('  additional_info text,')
    console.log('  status text NOT NULL DEFAULT \'pending\' CHECK (status IN (\'pending\', \'reviewing\', \'interview\', \'offer\', \'rejected\', \'withdrawn\')),')
    console.log('  applied_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL,')
    console.log('  updated_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL,')
    console.log('  reviewed_by uuid REFERENCES public.profiles(id),')
    console.log('  reviewed_at timestamp with time zone,')
    console.log('  notes text,')
    console.log('  UNIQUE(job_id, user_id)')
    console.log(');')
    console.log('\n-- Enable RLS')
    console.log('ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;')
    console.log('\n-- Create RLS policies')
    console.log('CREATE POLICY "Users can view their own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);')
    console.log('CREATE POLICY "Users can insert their own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);')
    console.log('CREATE POLICY "Admins can view all applications" ON public.applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.email IN (\'admin@fortisledger.io\', \'admin@fortisarena.io\', \'ahmedfaraz.sa.48@gmail.com\')));')
    console.log('CREATE POLICY "Admins can update all applications" ON public.applications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.email IN (\'admin@fortisledger.io\', \'admin@fortisarena.io\', \'ahmedfaraz.sa.48@gmail.com\')));')
    
    console.log('\n4. After running the SQL, come back and run this script again to verify.')
    
  } catch (err) {
    console.error('Error:', err)
  }
}

createApplicationsTableDirect()
