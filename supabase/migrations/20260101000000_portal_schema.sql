-- MapleLeaf Education — portal schema
-- Accounts/roles, courses, applications workflow, documents, offers, invoices, payments, notifications.

-- ============ 1. Enum ============
create type public.app_role as enum ('student', 'agent', 'college');

-- ============ 2. profiles ============
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  firstname text not null default '',
  lastname text not null default '',
  email text not null default '',
  org text,
  created_at timestamptz not null default now()
);
create index profiles_email_idx on public.profiles (lower(email));
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- ============ 3. user_roles (roles are never stored on profiles) ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

-- ============ 4. agents / colleges ============
create table public.agents (
  account_id uuid primary key references public.profiles (id) on delete cascade,
  agent_status text not null default 'active' check (agent_status in ('active', 'suspended')),
  created_at timestamptz not null default now()
);
grant select on public.agents to authenticated;
grant all on public.agents to service_role;
alter table public.agents enable row level security;

create table public.colleges (
  account_id uuid primary key references public.profiles (id) on delete cascade,
  college_name text not null default '',
  created_at timestamptz not null default now()
);
grant select on public.colleges to authenticated;
grant all on public.colleges to service_role;
alter table public.colleges enable row level security;

-- ============ 5. courses ============
create table public.courses (
  id text primary key,
  course_name text not null,
  college_name text not null,
  city text not null,
  course_type text not null,
  field text not null,
  duration text not null,
  tuition numeric(10, 2) not null default 0,
  language_level text not null check (language_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  intake text not null default '',
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.courses to anon, authenticated;
grant all on public.courses to service_role;
alter table public.courses enable row level security;

insert into public.courses
  (id, course_name, college_name, city, course_type, field, duration, tuition, language_level, intake, description)
values
  ('c1', 'Business Administration – Marketing', 'Maple Ridge College', 'Toronto', 'Diploma', 'Business', '2 years', 15800, 'B2', 'Jan / May / Sep', 'หลักสูตรบริหารธุรกิจเน้นการตลาดดิจิทัล มี Co-op 4 เดือน และเตรียมพร้อมสู่ Post-Graduation Work Permit'),
  ('c2', 'General English Program', 'Vancouver Language Institute', 'Vancouver', 'Language Program', 'Business', '3 months', 4200, 'A1', 'ทุกเดือน', 'หลักสูตรภาษาอังกฤษทั่วไป 25 ชั่วโมง/สัปดาห์ เหมาะสำหรับผู้เริ่มต้นและปรับพื้นฐานก่อนเข้าคอลเลจ'),
  ('c3', 'Computer Programming & Analysis', 'St. Lawrence Institute of Technology', 'Ottawa', 'Diploma', 'Information Technology', '2 years', 17400, 'B2', 'Jan / Sep', 'เขียนโปรแกรมเว็บและระบบฐานข้อมูล พร้อมโปรเจกต์จริงร่วมกับบริษัทเทคโนโลยีในออตตาวา'),
  ('c4', 'Hospitality & Tourism Management', 'Rockies Hospitality College', 'Calgary', 'Certificate', 'Hospitality', '1 year', 11200, 'B1', 'Feb / Aug', 'หลักสูตรการโรงแรมและท่องเที่ยว มีฝึกงานในรีสอร์ตเขตเทือกเขาร็อกกี'),
  ('c5', 'Practical Nursing Assistant', 'Halifax Health College', 'Halifax', 'Diploma', 'Healthcare', '2 years', 18900, 'C1', 'Sep', 'หลักสูตรผู้ช่วยพยาบาลที่ได้รับการรับรอง มีชั่วโมงปฏิบัติงานในโรงพยาบาลรัฐ'),
  ('c6', 'Graphic & Interactive Design', 'Montreal School of Design', 'Montreal', 'Certificate', 'Design', '1 year', 12600, 'B1', 'Jan / Sep', 'ออกแบบกราฟิกและ UI/UX พร้อมสร้าง Portfolio ระดับมืออาชีพ'),
  ('c7', 'Project Management (Postgraduate)', 'Maple Ridge College', 'Toronto', 'Postgraduate Diploma', 'Business', '1 year', 16300, 'B2', 'Jan / May', 'หลักสูตรต่อยอดสำหรับผู้จบปริญญาตรี เตรียมสอบ CAPM/PMP'),
  ('c8', 'Mechanical Engineering Technician', 'St. Lawrence Institute of Technology', 'Ottawa', 'Diploma', 'Engineering', '2 years', 16800, 'B1', 'Sep', 'ช่างเทคนิควิศวกรรมเครื่องกล เรียนการเขียนแบบ CAD และงานปฏิบัติในโรงงาน'),
  ('c9', 'Academic English Pathway', 'Maple Ridge College', 'Toronto', 'Language Program', 'Business', '6 months', 6800, 'A2', 'ทุก 8 สัปดาห์', 'ปรับพื้นฐานภาษาอังกฤษเชิงวิชาการ จบแล้วเข้าเรียน Diploma ได้โดยไม่ต้องสอบ IELTS')
on conflict (id) do nothing;

-- ============ 6. study interests / language tests ============
create table public.study_interests (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  city text not null default '',
  course_type text not null default '',
  field text not null default '',
  duration text not null default '',
  budget numeric(10, 2) not null default 0,
  education text not null default '',
  goal text not null default '',
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.study_interests to authenticated;
grant all on public.study_interests to service_role;
alter table public.study_interests enable row level security;

create table public.language_tests (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  test_type text not null,
  score text not null,
  level text not null check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  test_date date not null,
  expiry_date date,
  file_name text not null default '',
  file_path text not null default '',
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.language_tests to authenticated;
grant all on public.language_tests to service_role;
alter table public.language_tests enable row level security;

-- ============ 7. applications ============
create sequence public.application_code_seq start 1001;

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('AP-' || nextval('public.application_code_seq')::text),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id text not null references public.courses (id),
  agent_id uuid not null references public.agents (account_id),
  college_id uuid references public.colleges (account_id),
  status text not null default 'รอตรวจสอบ' check (status in ('รอตรวจสอบ', 'ส่งกลับให้แก้ไข', 'ส่งให้ College แล้ว', 'ออก Offer แล้ว', 'ส่งเอกสารให้นักเรียนแล้ว', 'รอชำระเงิน', 'รอตรวจสอบการชำระเงิน', 'ชำระเงินแล้ว', 'เตรียมรับนักเรียน', 'เสร็จสิ้น')),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index applications_student_idx on public.applications (student_id);
create index applications_agent_idx on public.applications (agent_id);
create index applications_college_idx on public.applications (college_id);
grant select, insert, update on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;

-- ============ 8. workflow child tables ============
create table public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  doc_key text not null,
  file_name text not null default '',
  file_path text not null default '',
  uploaded_by uuid references public.profiles (id) on delete set null,
  uploaded_at timestamptz not null default now(),
  unique (application_id, doc_key)
);
grant select, insert, update, delete on public.application_documents to authenticated;
grant all on public.application_documents to service_role;
alter table public.application_documents enable row level security;

create table public.application_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  status text not null,
  note text,
  actor_id uuid references public.profiles (id) on delete set null,
  actor_label text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert on public.application_history to authenticated;
grant all on public.application_history to service_role;
alter table public.application_history enable row level security;

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications (id) on delete cascade,
  file_name text not null default '',
  file_path text not null default '',
  sent_to_student boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.offers to authenticated;
grant all on public.offers to service_role;
alter table public.offers enable row level security;

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications (id) on delete cascade,
  file_name text not null default '',
  file_path text not null default '',
  amount numeric(10, 2) not null default 0,
  due_date date,
  sent_to_student boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.invoices to authenticated;
grant all on public.invoices to service_role;
alter table public.invoices enable row level security;

create sequence public.payment_code_seq start 101;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('PM-' || nextval('public.payment_code_seq')::text),
  application_id uuid not null references public.applications (id) on delete cascade,
  amount numeric(10, 2) not null default 0,
  paid_date date not null,
  file_name text not null default '',
  file_path text not null default '',
  status text not null default 'รอตรวจสอบการชำระเงิน' check (status in ('รอตรวจสอบการชำระเงิน', 'ส่งกลับให้แก้ไข', 'Agent ตรวจแล้ว', 'ชำระเงินแล้ว')),
  note text,
  submitted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index payments_application_idx on public.payments (application_id);
grant select, insert, update on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default '',
  body text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, read);
grant select, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;

-- ============ 9. helper functions ============
create or replace function public.level_rank(l text)
returns int
language sql
immutable
set search_path = public
as $$
  select coalesce(array_position(array['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], l), 0);
$$;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

create or replace function public.my_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.user_roles where user_id = auth.uid() limit 1;
$$;

create or replace function public.is_party_on(p_application_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.applications a
    where a.id = p_application_id
      and (a.student_id = auth.uid() or a.agent_id = auth.uid() or a.college_id = auth.uid())
  );
$$;

-- notifications are written for other accounts, so this runs as the function owner
create or replace function public.post_notification(_user_id uuid, _title text, _body text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (user_id, title, body) values (_user_id, _title, _body);
$$;

-- automatic language-level check: nobody can file an application the student is not qualified for
create or replace function public.enforce_language_level()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  required int;
  owned int;
begin
  select public.level_rank(c.language_level) into required from public.courses c where c.id = new.course_id;
  select public.level_rank(t.level) into owned from public.language_tests t where t.user_id = new.student_id;
  if required is null then
    raise exception 'course % not found', new.course_id;
  end if;
  if owned is null or owned < required then
    raise exception 'Language level is too low for this course';
  end if;
  return new;
end;
$$;

create trigger applications_enforce_language_level
  before insert on public.applications
  for each row execute function public.enforce_language_level();

grant execute on function public.level_rank(text) to anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.my_role() to authenticated;
grant execute on function public.is_party_on(uuid) to authenticated;
grant execute on function public.post_notification(uuid, text, text) to authenticated;

-- ============ 10. Row Level Security policies ============
create policy "profiles: own read" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles: staff read linked students" on public.profiles
  for select to authenticated using (
    exists (
      select 1 from public.applications a
      where a.student_id = profiles.id
        and (a.agent_id = auth.uid() or a.college_id = auth.uid())
    )
  );

create policy "profiles: own update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "user_roles: own read" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create policy "agents: own read" on public.agents
  for select to authenticated using (account_id = auth.uid());

create policy "agents: staff read" on public.agents
  for select to authenticated using (public.has_role(account_id, 'agent') or public.has_role(account_id, 'college'));

create policy "colleges: own read" on public.colleges
  for select to authenticated using (account_id = auth.uid());

create policy "colleges: staff read" on public.colleges
  for select to authenticated using (public.has_role(account_id, 'agent') or public.has_role(account_id, 'college'));

create policy "courses: public read" on public.courses
  for select to anon, authenticated using (is_active);

create policy "study_interests: own all" on public.study_interests
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "study_interests: staff read" on public.study_interests
  for select to authenticated using (
    exists (
      select 1 from public.applications a
      where a.student_id = study_interests.user_id
        and (a.agent_id = auth.uid() or a.college_id = auth.uid())
    )
  );

create policy "language_tests: own all" on public.language_tests
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "language_tests: staff read" on public.language_tests
  for select to authenticated using (
    exists (
      select 1 from public.applications a
      where a.student_id = language_tests.user_id
        and (a.agent_id = auth.uid() or a.college_id = auth.uid())
    )
  );

create policy "applications: student read" on public.applications
  for select to authenticated using (student_id = auth.uid());

create policy "applications: agent read" on public.applications
  for select to authenticated using (agent_id = auth.uid());

create policy "applications: college read" on public.applications
  for select to authenticated using (college_id = auth.uid());

create policy "applications: student insert" on public.applications
  for insert to authenticated with check (
    student_id = auth.uid() and public.has_role(auth.uid(), 'student')
  );

create policy "applications: parties update" on public.applications
  for update to authenticated
  using (student_id = auth.uid() or agent_id = auth.uid() or college_id = auth.uid())
  with check (student_id = auth.uid() or agent_id = auth.uid() or college_id = auth.uid());

create policy "documents: party read" on public.application_documents
  for select to authenticated using (public.is_party_on(application_id));

create policy "documents: party insert" on public.application_documents
  for insert to authenticated with check (public.is_party_on(application_id) and uploaded_by = auth.uid());

create policy "documents: party update" on public.application_documents
  for update to authenticated using (public.is_party_on(application_id)) with check (public.is_party_on(application_id));

create policy "documents: party delete" on public.application_documents
  for delete to authenticated using (public.is_party_on(application_id));

create policy "history: party read" on public.application_history
  for select to authenticated using (public.is_party_on(application_id));

create policy "history: party insert" on public.application_history
  for insert to authenticated with check (public.is_party_on(application_id) and actor_id = auth.uid());

create policy "offers: party read" on public.offers
  for select to authenticated using (public.is_party_on(application_id));

create policy "offers: party write" on public.offers
  for insert to authenticated with check (public.is_party_on(application_id));

create policy "offers: party update" on public.offers
  for update to authenticated using (public.is_party_on(application_id)) with check (public.is_party_on(application_id));

create policy "invoices: party read" on public.invoices
  for select to authenticated using (public.is_party_on(application_id));

create policy "invoices: party write" on public.invoices
  for insert to authenticated with check (public.is_party_on(application_id));

create policy "invoices: party update" on public.invoices
  for update to authenticated using (public.is_party_on(application_id)) with check (public.is_party_on(application_id));

create policy "payments: party read" on public.payments
  for select to authenticated using (public.is_party_on(application_id));

create policy "payments: party insert" on public.payments
  for insert to authenticated with check (public.is_party_on(application_id) and submitted_by = auth.uid());

create policy "payments: party update" on public.payments
  for update to authenticated using (public.is_party_on(application_id)) with check (public.is_party_on(application_id));

create policy "notifications: own read" on public.notifications
  for select to authenticated using (user_id = auth.uid());

create policy "notifications: own update" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============ 11. Storage policies ============
-- buckets: documents (application docs), results (language test results), offers, invoices, payments
-- path convention: <application_id>/<file> for the workflow buckets, <user_id>/<file> for results
create policy "documents: upload by party" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "documents: read by party" on storage.objects
  for select to authenticated
  using (bucket_id = 'documents' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "documents: replace by party" on storage.objects
  for update to authenticated
  using (bucket_id = 'documents' and public.is_party_on(((storage.foldername(name))[1])::uuid))
  with check (bucket_id = 'documents' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "documents: delete by party" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "offers: upload by party" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'offers' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "offers: read by party" on storage.objects
  for select to authenticated
  using (bucket_id = 'offers' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "invoices: upload by party" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'invoices' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "invoices: read by party" on storage.objects
  for select to authenticated
  using (bucket_id = 'invoices' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "payments: upload by party" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'payments' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "payments: read by party" on storage.objects
  for select to authenticated
  using (bucket_id = 'payments' and public.is_party_on(((storage.foldername(name))[1])::uuid));

create policy "results: own upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'results' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "results: own read" on storage.objects
  for select to authenticated
  using (bucket_id = 'results' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "results: staff read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'results'
    and exists (
      select 1 from public.applications a
      where a.student_id::text = (storage.foldername(name))[1]
        and (a.agent_id = auth.uid() or a.college_id = auth.uid())
    )
  );
