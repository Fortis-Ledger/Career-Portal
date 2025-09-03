-- Create jobs table
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  requirements text,
  responsibilities text,
  benefits text,
  salary_min integer,
  salary_max integer,
  currency text default 'USD',
  employment_type text not null check (employment_type in ('full-time', 'part-time', 'contract', 'internship')),
  experience_level text not null check (experience_level in ('entry', 'mid', 'senior', 'lead', 'executive')),
  location text,
  is_remote boolean default false,
  is_hybrid boolean default false,
  department text,
  application_deadline date,
  is_active boolean default true,
  is_featured boolean default false,
  view_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.jobs enable row level security;

-- Allow everyone to view active jobs
create policy "Anyone can view active jobs"
  on public.jobs for select
  using (is_active = true);

-- Only admins can manage jobs
create policy "Admins can manage jobs"
  on public.jobs for all
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and p.email in (
        'admin@fortisledger.io',
        'admin@fortisarena.io',
        'ahmedfaraz.sa.48@gmail.com'
      )
    )
  );

-- Add updated_at trigger to jobs
create trigger handle_jobs_updated_at
  before update on public.jobs
  for each row
  execute function public.handle_updated_at();

-- Create job_skills junction table
create table if not exists public.job_skills (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  is_required boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, skill_id)
);

-- Enable RLS
alter table public.job_skills enable row level security;

-- Allow everyone to view job skills
create policy "Anyone can view job skills"
  on public.job_skills for select
  using (true);

-- Only admins can manage job skills
create policy "Admins can manage job skills"
  on public.job_skills for all
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and p.email in (
        'admin@fortisledger.io',
        'admin@fortisarena.io',
        'ahmedfaraz.sa.48@gmail.com'
      )
    )
  );
