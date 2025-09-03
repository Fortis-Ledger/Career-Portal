-- Create companies/departments table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  industry text,
  size_category text check (size_category in ('startup', 'small', 'medium', 'large', 'enterprise')),
  location text,
  website_url text,
  logo_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.companies enable row level security;

-- Allow everyone to view active companies
create policy "Anyone can view active companies"
  on public.companies for select
  using (is_active = true);

-- Only admins can manage companies
create policy "Admins can manage companies"
  on public.companies for all
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

-- Add updated_at trigger to companies
create trigger handle_companies_updated_at
  before update on public.companies
  for each row
  execute function public.handle_updated_at();

-- Insert FortisLedger as the main company
insert into public.companies (name, description, industry, size_category, location, website_url)
values (
  'FortisLedger',
  'Leading innovation across Quantum Computing, Web3, AI, IoT, and Engineering solutions',
  'Technology',
  'enterprise',
  'Global',
  'https://fortis-ledger.com'
) on conflict do nothing;
