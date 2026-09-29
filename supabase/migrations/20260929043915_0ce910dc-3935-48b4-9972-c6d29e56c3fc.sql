-- Tighten the security-definer helpers exposed by the portal schema migration:
-- no anon execution, and notifications can only be posted about an application you are a party on.

revoke execute on function public.level_rank(text) from public, anon;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
revoke execute on function public.my_role() from public, anon;
revoke execute on function public.is_party_on(uuid) from public, anon;
revoke execute on function public.post_notification(uuid, text, text) from public, anon, authenticated;
revoke execute on function public.enforce_language_level() from public, anon, authenticated;

drop function public.post_notification(uuid, text, text);

-- Notifications are written for other accounts (that is why this is security definer),
-- so the caller must be a party on the application and the recipient must be a party too.
create or replace function public.post_notification(_application_id uuid, _user_id uuid, _title text, _body text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.applications;
begin
  select * into a from public.applications where id = _application_id;
  if not found then
    raise exception 'application not found';
  end if;
  if not (a.student_id = auth.uid() or a.agent_id = auth.uid() or a.college_id = auth.uid()) then
    raise exception 'caller is not a party on this application';
  end if;
  if not (_user_id = a.student_id or _user_id = a.agent_id or _user_id = a.college_id) then
    raise exception 'recipient is not a party on this application';
  end if;
  insert into public.notifications (user_id, title, body) values (_user_id, _title, _body);
end;
$$;

revoke execute on function public.post_notification(uuid, uuid, text, text) from public, anon;
grant execute on function public.post_notification(uuid, uuid, text, text) to authenticated;
