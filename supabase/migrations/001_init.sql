create extension if not exists pgcrypto;
create type public.user_role as enum ('student','agent','college');
create type public.cefr_level as enum ('A1','A2','B1','B2','C1','C2');
create type public.language_status as enum ('pending_verification','verified','rejected','expired');
create type public.application_status as enum ('draft','pending_agent_review','needs_student_revision','sent_to_college','needs_agent_revision','offer_issued','documents_sent','awaiting_payment','payment_under_review','paid','preparing_student','completed');
create type public.payment_status as enum ('pending_agent','needs_revision','pending_college','confirmed');

create table public.colleges (id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, city text not null, created_at timestamptz not null default now());
create table public.profiles (id uuid primary key references auth.users on delete cascade, email text unique not null, first_name text not null default '', last_name text not null default '', role public.user_role not null default 'student', organization text not null default '', college_id uuid references public.colleges, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.study_interests (student_id uuid primary key references public.profiles on delete cascade, city text not null, course_type text not null, field text not null, duration_months int not null check(duration_months>0), budget_cad numeric(12,2) not null check(budget_cad>0), education_level text not null, goal text not null default '', updated_at timestamptz not null default now());
create table public.courses (id uuid primary key default gen_random_uuid(), college_id uuid not null references public.colleges on delete cascade, name text not null, city text not null, course_type text not null, field text not null, duration_months int not null check(duration_months>0), tuition_cad numeric(12,2) not null check(tuition_cad>0), required_cefr public.cefr_level not null, min_education text not null, description text not null default '', active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.course_document_requirements (id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses on delete cascade, name text not null, required boolean not null default true, sort_order int not null default 0);
create table public.language_results (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles on delete cascade, test_type text not null check(test_type in ('IELTS','TOEFL iBT','Duolingo English Test','CELPIP','PTE Academic')), score_value numeric(6,2) not null, score_scale text not null, test_date date not null, proof_path text not null, verification_status public.language_status not null default 'pending_verification', verified_cefr public.cefr_level, expires_at date, verified_by uuid references public.profiles, verified_at timestamptz, rejection_reason text, submitted_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.language_result_events (id uuid primary key default gen_random_uuid(), language_result_id uuid not null references public.language_results on delete cascade, actor_id uuid not null references public.profiles, action text not null, reason text, created_at timestamptz not null default now());
create table public.applications (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles, course_id uuid not null references public.courses, college_id uuid not null references public.colleges, agent_id uuid references public.profiles, status public.application_status not null default 'draft', created_at timestamptz not null default now(), submitted_at timestamptz, updated_at timestamptz not null default now());
create table public.application_documents (id uuid primary key default gen_random_uuid(), application_id uuid not null references public.applications on delete cascade, requirement_name text not null, required boolean not null default true, storage_path text, review_status text not null default 'missing' check(review_status in ('missing','uploaded','accepted','rejected')), review_reason text, uploaded_at timestamptz, unique(application_id,requirement_name));
create table public.application_events (id uuid primary key default gen_random_uuid(), application_id uuid not null references public.applications on delete cascade, actor_id uuid not null references public.profiles, actor_role public.user_role not null, status public.application_status not null, action text not null, reason text, created_at timestamptz not null default now());
create table public.offers (id uuid primary key default gen_random_uuid(), application_id uuid unique not null references public.applications on delete cascade, storage_path text not null, created_by uuid not null references public.profiles, created_at timestamptz not null default now(), forwarded_at timestamptz);
create table public.invoices (id uuid primary key default gen_random_uuid(), application_id uuid unique not null references public.applications on delete cascade, storage_path text not null, amount_cad numeric(12,2) not null check(amount_cad>0), due_date date not null, created_by uuid not null references public.profiles, created_at timestamptz not null default now(), forwarded_at timestamptz);
create table public.payments (id uuid primary key default gen_random_uuid(), application_id uuid unique not null references public.applications on delete cascade, amount_cad numeric(12,2) not null check(amount_cad>0), paid_at date not null, proof_path text not null, status public.payment_status not null default 'pending_agent', rejection_reason text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles on delete cascade, title text not null, message text not null, href text not null default '/portal/dashboard', read_at timestamptz, created_at timestamptz not null default now());

create index applications_status_idx on public.applications(status);
create index applications_agent_idx on public.applications(agent_id);
create index applications_college_idx on public.applications(college_id);
create index language_pending_idx on public.language_results(verification_status);
create index notifications_user_idx on public.notifications(user_id,created_at desc);

create or replace function public.my_role() returns public.user_role language sql stable security definer set search_path=public as $$ select role from public.profiles where id=auth.uid() $$;
create or replace function public.my_college() returns uuid language sql stable security definer set search_path=public as $$ select college_id from public.profiles where id=auth.uid() $$;
create or replace function public.can_access_application(app public.applications) returns boolean language sql stable security definer set search_path=public as $$ select auth.uid()=app.student_id or (public.my_role()='agent' and ((app.agent_id is null and app.status='pending_agent_review') or app.agent_id=auth.uid())) or (public.my_role()='college' and app.college_id=public.my_college() and app.status not in ('draft','pending_agent_review','needs_student_revision')) $$;

alter table public.colleges enable row level security; alter table public.profiles enable row level security; alter table public.study_interests enable row level security; alter table public.courses enable row level security; alter table public.course_document_requirements enable row level security; alter table public.language_results enable row level security; alter table public.language_result_events enable row level security; alter table public.applications enable row level security; alter table public.application_documents enable row level security; alter table public.application_events enable row level security; alter table public.offers enable row level security; alter table public.invoices enable row level security; alter table public.payments enable row level security; alter table public.notifications enable row level security;

create policy colleges_read on public.colleges for select using(true);
create policy profiles_read on public.profiles for select to authenticated using(id=auth.uid() or public.my_role()='agent' or (public.my_role()='college' and college_id=public.my_college()));
create policy profiles_self_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy interests_owner on public.study_interests for all to authenticated using(student_id=auth.uid()) with check(student_id=auth.uid());
create policy interests_agent_read on public.study_interests for select to authenticated using(public.my_role()='agent');
create policy courses_read on public.courses for select using(active or (auth.uid() is not null and (public.my_role()='agent' or college_id=public.my_college())));
create policy courses_college_insert on public.courses for insert to authenticated with check(public.my_role()='college' and college_id=public.my_college());
create policy courses_college_update on public.courses for update to authenticated using(public.my_role()='college' and college_id=public.my_college()) with check(college_id=public.my_college());
create policy courses_college_delete on public.courses for delete to authenticated using(public.my_role()='college' and college_id=public.my_college());
create policy requirements_read on public.course_document_requirements for select using(true);
create policy requirements_college_all on public.course_document_requirements for all to authenticated using(exists(select 1 from public.courses c where c.id=course_id and c.college_id=public.my_college())) with check(exists(select 1 from public.courses c where c.id=course_id and c.college_id=public.my_college()));
create policy language_student_read on public.language_results for select to authenticated using(student_id=auth.uid() or public.my_role()='agent');
create policy language_student_insert on public.language_results for insert to authenticated with check(student_id=auth.uid() and verification_status='pending_verification');
create policy language_student_update on public.language_results for update to authenticated using(student_id=auth.uid() and verification_status in ('pending_verification','rejected')) with check(student_id=auth.uid() and verification_status='pending_verification');
create policy language_agent_update on public.language_results for update to authenticated using(public.my_role()='agent') with check(public.my_role()='agent');
create policy language_events_read on public.language_result_events for select to authenticated using(exists(select 1 from public.language_results l where l.id=language_result_id and (l.student_id=auth.uid() or public.my_role()='agent')));
create policy applications_read on public.applications for select to authenticated using(public.can_access_application(applications));
create policy applications_student_insert on public.applications for insert to authenticated with check(student_id=auth.uid() and status='draft');
create policy applications_student_update on public.applications for update to authenticated using(student_id=auth.uid() and status in ('draft','needs_student_revision'));
create policy applications_agent_update on public.applications for update to authenticated using(public.my_role()='agent' and (agent_id is null or agent_id=auth.uid()));
create policy applications_college_update on public.applications for update to authenticated using(public.my_role()='college' and college_id=public.my_college());
create policy app_docs_access on public.application_documents for all to authenticated using(exists(select 1 from public.applications a where a.id=application_id and public.can_access_application(a))) with check(exists(select 1 from public.applications a where a.id=application_id and public.can_access_application(a)));
create policy events_read on public.application_events for select to authenticated using(exists(select 1 from public.applications a where a.id=application_id and public.can_access_application(a)));
create policy documents_read on public.offers for select to authenticated using(exists(select 1 from public.applications a where a.id=application_id and public.can_access_application(a)));
create policy invoices_read on public.invoices for select to authenticated using(exists(select 1 from public.applications a where a.id=application_id and public.can_access_application(a)));
create policy payments_read on public.payments for select to authenticated using(exists(select 1 from public.applications a where a.id=application_id and public.can_access_application(a)));
create policy notifications_owner_read on public.notifications for select to authenticated using(user_id=auth.uid());
create policy notifications_owner_update on public.notifications for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare v_role public.user_role; v_college uuid;
begin
  v_role:=coalesce((new.raw_app_meta_data->>'role')::public.user_role,'student');
  if v_role='college' then select id into v_college from public.colleges where slug=new.raw_app_meta_data->>'college_slug'; end if;
  insert into public.profiles(id,email,first_name,last_name,role,organization,college_id) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'first_name',''),coalesce(new.raw_user_meta_data->>'last_name',''),v_role,coalesce(new.raw_user_meta_data->>'organization',''),v_college);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.claim_application(p_application uuid) returns public.applications language plpgsql security definer set search_path=public as $$
declare v_app public.applications;
begin
  if public.my_role()<>'agent' then raise exception 'agent only'; end if;
  update public.applications set agent_id=auth.uid(),updated_at=now() where id=p_application and status='pending_agent_review' and agent_id is null returning * into v_app;
  if v_app.id is null then raise exception 'application already claimed or unavailable'; end if;
  insert into public.application_events(application_id,actor_id,actor_role,status,action) values(v_app.id,auth.uid(),'agent',v_app.status,'Agent รับเคส');
  return v_app;
end $$;

create or replace function public.review_language_result(p_result uuid,p_approved boolean,p_cefr public.cefr_level default null,p_expires date default null,p_reason text default null) returns public.language_results language plpgsql security definer set search_path=public as $$
declare v_result public.language_results;
begin
  if public.my_role()<>'agent' then raise exception 'agent only'; end if;
  if p_approved and p_cefr is null then raise exception 'verified CEFR required'; end if;
  if not p_approved and nullif(trim(p_reason),'') is null then raise exception 'rejection reason required'; end if;
  update public.language_results set verification_status=case when p_approved then 'verified'::public.language_status else 'rejected'::public.language_status end,verified_cefr=case when p_approved then p_cefr else null end,expires_at=case when p_approved then p_expires else null end,verified_by=auth.uid(),verified_at=now(),rejection_reason=case when p_approved then null else trim(p_reason) end,updated_at=now() where id=p_result and verification_status='pending_verification' returning * into v_result;
  if v_result.id is null then raise exception 'language result unavailable'; end if;
  insert into public.language_result_events(language_result_id,actor_id,action,reason) values(v_result.id,auth.uid(),case when p_approved then 'approved' else 'rejected' end,case when p_approved then null else trim(p_reason) end);
  insert into public.notifications(user_id,title,message,href) values(v_result.student_id,case when p_approved then 'ผลภาษาได้รับการยืนยัน' else 'ผลภาษาต้องแก้ไข' end,case when p_approved then 'Verified CEFR: '||p_cefr::text else trim(p_reason) end,'/portal/language-test');
  return v_result;
end $$;

create or replace function public.submit_application(p_application uuid) returns public.applications language plpgsql security definer set search_path=public as $$
declare v_app public.applications; v_missing int; v_lang int;
begin
  select count(*) into v_missing from public.application_documents where application_id=p_application and required and storage_path is null;
  select count(*) into v_lang from public.language_results l join public.applications a on a.student_id=l.student_id join public.courses c on c.id=a.course_id where a.id=p_application and l.verification_status='verified' and (l.expires_at is null or l.expires_at>=current_date) and array_position(enum_range(null::public.cefr_level),l.verified_cefr)>=array_position(enum_range(null::public.cefr_level),c.required_cefr);
  if v_missing>0 then raise exception 'required documents missing'; end if; if v_lang=0 then raise exception 'verified language result required'; end if;
  update public.applications set status='pending_agent_review',submitted_at=now(),updated_at=now() where id=p_application and student_id=auth.uid() and status in ('draft','needs_student_revision') returning * into v_app;
  if v_app.id is null then raise exception 'application unavailable'; end if;
  insert into public.application_events(application_id,actor_id,actor_role,status,action) values(v_app.id,auth.uid(),'student',v_app.status,'Student ส่ง Application'); return v_app;
end $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('private-documents','private-documents',false,10485760,array['application/pdf','image/jpeg','image/png']) on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
create policy storage_student_insert on storage.objects for insert to authenticated with check(bucket_id='private-documents' and (storage.foldername(name))[1]=auth.uid()::text);
create policy storage_owner_read on storage.objects for select to authenticated using(bucket_id='private-documents' and ((storage.foldername(name))[1]=auth.uid()::text or public.my_role()='agent' or exists(select 1 from public.applications a where a.id::text=(storage.foldername(name))[2] and public.can_access_application(a))));
create policy storage_owner_update on storage.objects for update to authenticated using(bucket_id='private-documents' and (storage.foldername(name))[1]=auth.uid()::text);

insert into public.colleges(slug,name,city) values('maple-ridge-college','Maple Ridge College','Toronto'),('vancouver-language','Vancouver Language Institute','Vancouver'),('montreal-school','Montreal School of Design','Montreal'),('rockies-college','Rockies Hospitality College','Calgary') on conflict(slug) do nothing;
