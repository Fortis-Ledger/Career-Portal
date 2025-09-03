-- Create skills table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.skills enable row level security;

-- Allow everyone to view active skills
create policy "Anyone can view active skills"
  on public.skills for select
  using (is_active = true);

-- Only admins can manage skills
  on public.skills for all
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

-- Insert common skills for FortisLedger
insert into public.skills (name, category) values
  -- Quantum Computing
  ('Quantum Computing', 'Quantum'),
  ('Qiskit', 'Quantum'),
  ('Quantum Algorithms', 'Quantum'),
  ('Quantum Machine Learning', 'Quantum'),
  
  -- Web3
  ('Blockchain', 'Web3'),
  ('Solidity', 'Web3'),
  ('Smart Contracts', 'Web3'),
  ('DeFi', 'Web3'),
  ('NFTs', 'Web3'),
  ('Ethereum', 'Web3'),
  
  -- AI/ML
  ('Machine Learning', 'AI'),
  ('Deep Learning', 'AI'),
  ('Natural Language Processing', 'AI'),
  ('Computer Vision', 'AI'),
  ('TensorFlow', 'AI'),
  ('PyTorch', 'AI'),
  ('Python', 'Programming'),
  
  -- IoT
  ('Internet of Things', 'IoT'),
  ('Embedded Systems', 'IoT'),
  ('Arduino', 'IoT'),
  ('Raspberry Pi', 'IoT'),
  ('Sensor Networks', 'IoT'),
  
  -- Engineering
  ('Software Engineering', 'Engineering'),
  ('DevOps', 'Engineering'),
  ('Cloud Computing', 'Engineering'),
  ('Microservices', 'Engineering'),
  ('Kubernetes', 'Engineering'),
  ('Docker', 'Engineering'),
  
  -- Programming Languages
  ('JavaScript', 'Programming'),
  ('TypeScript', 'Programming'),
  ('React', 'Programming'),
  ('Node.js', 'Programming'),
  ('Go', 'Programming'),
  ('Rust', 'Programming'),
  ('Java', 'Programming'),
  ('C++', 'Programming')
on conflict (name) do nothing;
