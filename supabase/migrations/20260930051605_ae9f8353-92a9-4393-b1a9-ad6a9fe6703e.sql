-- Staging area inside the documents bucket: a student can hold files here while the
-- application record does not exist yet. The submit handler moves them into
-- <application_id>/... and deletes the staged copy.
create policy "documents: own staging insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'staging'
  );

create policy "documents: own staging read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'staging'
  );

create policy "documents: own staging replace" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'staging'
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'staging'
  );

create policy "documents: own staging delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'staging'
  );

-- A student must be able to swap in a newer language test result.
create policy "results: own delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'results'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "results: own replace" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'results'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'results'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Students need to know which agent office is currently accepting applications so a
-- new application can be routed automatically. They only ever see active offices
-- and no personal details.
create policy "agents: students read active"
  on public.agents
  for select to authenticated
  using (
    agent_status = 'active'
    and public.has_role(account_id, 'agent')
    and public.has_role(auth.uid(), 'student')
  );