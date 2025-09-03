-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter text,
  resume_url text,
  portfolio_url text,
  additional_info text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn')),
  applied_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamp with time zone,
  notes text,
  UNIQUE(job_id, user_id)
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert their own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.email IN (
        'admin@fortisledger.io',
        'admin@fortisarena.io',
        'ahmedfaraz.sa.48@gmail.com'
      )
    )
  );

-- Admins can update all applications
CREATE POLICY "Admins can update all applications"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.email IN (
        'admin@fortisledger.io',
        'admin@fortisarena.io',
        'ahmedfaraz.sa.48@gmail.com'
      )
    )
  );

-- Insert sample application for testing
INSERT INTO public.applications (job_id, user_id, cover_letter, status)
SELECT 
  j.id as job_id,
  p.id as user_id,
  'I am very interested in this position and believe my skills align well with the requirements.' as cover_letter,
  'pending' as status
FROM public.jobs j
CROSS JOIN public.profiles p
WHERE j.is_active = true
AND p.email = 'ahmedfaraz.sa.48@gmail.com'
LIMIT 1
ON CONFLICT (job_id, user_id) DO NOTHING;
