alter table public.courses add column if not exists college_id uuid references public.colleges(account_id);
update public.courses set college_id = (select account_id from public.colleges order by created_at limit 1) where college_id is null;
grant select, insert, update on public.courses to authenticated;
create policy "courses: college read own" on public.courses for select to authenticated using (college_id = auth.uid());
create policy "courses: college insert own" on public.courses for insert to authenticated with check (college_id = auth.uid() and public.has_role(auth.uid(), 'college'::app_role));
create policy "courses: college update own" on public.courses for update to authenticated using (college_id = auth.uid()) with check (college_id = auth.uid() and public.has_role(auth.uid(), 'college'::app_role));
grant update (firstname, lastname, org) on public.profiles to authenticated;