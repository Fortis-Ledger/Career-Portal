-- Create useful views and functions for the career portal

-- View for job listings with company and skill information
create or replace view public.job_listings as
select 
  j.id,
  j.title,
  j.description,
  j.requirements,
  j.responsibilities,
  j.benefits,
  j.salary_min,
  j.salary_max,
  j.currency,
  j.employment_type,
  j.experience_level,
  j.location,
  j.is_remote,
  j.is_hybrid,
  j.department,
  j.application_deadline,
  j.is_featured,
  j.view_count,
  j.created_at,
  j.updated_at,
  c.name as company_name,
  c.description as company_description,
  c.industry as company_industry,
  c.location as company_location,
  c.logo_url as company_logo,
  array_agg(
    json_build_object(
      'id', s.id,
      'name', s.name,
      'category', s.category,
      'is_required', js.is_required
    )
  ) filter (where s.id is not null) as skills
from public.jobs j
join public.companies c on j.company_id = c.id
left join public.job_skills js on j.id = js.job_id
left join public.skills s on js.skill_id = s.id
where j.is_active = true and c.is_active = true
group by j.id, c.id;

-- Function to increment job view count
create or replace function public.increment_job_views(job_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.jobs 
  set view_count = view_count + 1 
  where id = job_id and is_active = true;
end;
$$;

-- Function to get application statistics
create or replace function public.get_application_stats()
returns json
language plpgsql
security invoker
as $$
declare
  result json;
begin
  -- Only allow admins to view stats
  if not exists (
    select 1 from public.profiles p 
    where p.id = auth.uid() 
    and p.email in (
      'admin@fortisledger.io',
      'admin@fortisarena.io',
      'ahmedfaraz.sa.48@gmail.com'
    )
  ) then
    raise exception 'Access denied';
  end if;

  select json_build_object(
    'total_applications', count(*),
    'pending_applications', count(*) filter (where status = 'pending'),
    'reviewing_applications', count(*) filter (where status = 'reviewing'),
    'interview_applications', count(*) filter (where status = 'interview'),
    'offer_applications', count(*) filter (where status = 'offer'),
    'rejected_applications', count(*) filter (where status = 'rejected'),
    'withdrawn_applications', count(*) filter (where status = 'withdrawn'),
    'applications_this_month', count(*) filter (where applied_at >= date_trunc('month', current_date)),
    'applications_this_week', count(*) filter (where applied_at >= date_trunc('week', current_date))
  ) into result
  from public.applications;
  
  return result;
end;
$$;

-- Function to search jobs
create or replace function public.search_jobs(
  search_query text default '',
  skill_ids uuid[] default array[]::uuid[],
  employment_types text[] default array[]::text[],
  experience_levels text[] default array[]::text[],
  is_remote_only boolean default false,
  salary_min integer default 0,
  limit_count integer default 20,
  offset_count integer default 0
)
returns setof public.job_listings
language plpgsql
security invoker
as $$
begin
  return query
  select jl.*
  from public.job_listings jl
  where 
    (search_query = '' or (
      jl.title ilike '%' || search_query || '%' or
      jl.description ilike '%' || search_query || '%' or
      jl.company_name ilike '%' || search_query || '%'
    ))
    and (array_length(skill_ids, 1) is null or exists (
      select 1 from public.job_skills js 
      where js.job_id = jl.id 
      and js.skill_id = any(skill_ids)
    ))
    and (array_length(employment_types, 1) is null or jl.employment_type = any(employment_types))
    and (array_length(experience_levels, 1) is null or jl.experience_level = any(experience_levels))
    and (not is_remote_only or jl.is_remote = true)
    and (salary_min = 0 or jl.salary_max >= salary_min)
  order by jl.is_featured desc, jl.created_at desc
  limit limit_count
  offset offset_count;
end;
$$;
