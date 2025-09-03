-- Create storage buckets for profile images
-- Run this in your Supabase SQL Editor

-- Create profile-pictures bucket
insert into storage.buckets (id, name, public)
values ('profile-pictures', 'profile-pictures', true)
on conflict (id) do nothing;

-- Create cover-images bucket
insert into storage.buckets (id, name, public)
values ('cover-images', 'cover-images', true)
on conflict (id) do nothing;

-- Set up storage policies for profile pictures
create policy "Profile pictures are publicly accessible"
on storage.objects for select
using (bucket_id = 'profile-pictures');

create policy "Users can upload their own profile picture"
on storage.objects for insert
with check (
  bucket_id = 'profile-pictures' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own profile picture"
on storage.objects for update
using (
  bucket_id = 'profile-pictures' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own profile picture"
on storage.objects for delete
using (
  bucket_id = 'profile-pictures' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for cover images
create policy "Cover images are publicly accessible"
on storage.objects for select
using (bucket_id = 'cover-images');

create policy "Users can upload their own cover image"
on storage.objects for insert
with check (
  bucket_id = 'cover-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own cover image"
on storage.objects for update
using (
  bucket_id = 'cover-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own cover image"
on storage.objects for delete
using (
  bucket_id = 'cover-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);
