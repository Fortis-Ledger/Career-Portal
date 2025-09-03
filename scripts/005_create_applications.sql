-- Create job applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  cover_letter text,
  resume_url text,
  portfolio_url text,
  additional_info text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn')),
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamp with time zone,
  notes text,
  unique(job_id, user_id)
);

-- Enable RLS
alter table public.applications enable row level security;

-- Users can view their own applications
create policy "Users can view their own applications"
  on public.applications for select
  using (auth.uid() = user_id);

-- Users can insert their own applications
create policy "Users can insert their own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

-- Users can update their own applications (for withdrawal)
create policy "Users can update their own applications"
  on public.applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins can view and manage all applications
create policy "Admins can view all applications"
  on public.applications for select
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

create policy "Admins can update all applications"
  on public.applications for update
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

-- Add updated_at trigger to applications
create trigger handle_applications_updated_at
  before update on public.applications
  for each row
  execute function public.handle_updated_at();

-- Create application status history table for tracking changes
create table if not exists public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references public.profiles(id),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.application_status_history enable row level security;

-- Users can view history of their own applications
create policy "Users can view their own application history"
  on public.application_status_history for select
  using (
    exists (
      select 1 from public.applications a 
      where a.id = application_id 
      and a.user_id = auth.uid()
    )
  );

-- Admins can view all application history
create policy "Admins can view all application history"
  on public.application_status_history for select
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

-- Only admins can insert application history
create policy "Admins can insert application history"
  on public.application_status_history for insert
  with check (
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
