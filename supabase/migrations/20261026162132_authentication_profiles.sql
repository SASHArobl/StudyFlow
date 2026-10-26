-- Private data and narrow, session-validated RPCs. No client table access.
create schema if not exists app_data;
create schema if not exists private;
create schema if not exists api;
revoke all on schema app_data, private, api from public, anon, authenticated;
create role studyflow_api nologin noinherit nobypassrls;
-- Auth schema USAGE is managed by Supabase. Inherit its standard authenticated
-- privileges without allowing SET ROLE; private table access stays explicit below.
grant authenticated to studyflow_api with inherit true, set false;
grant usage on schema app_data, private, api to studyflow_api;
grant usage on schema api to authenticated;
grant execute on function auth.uid(), auth.jwt() to studyflow_api;
grant select (id, email_confirmed_at, deleted_at, banned_until) on auth.users to studyflow_api;
grant select (id, user_id, not_after) on auth.sessions to studyflow_api;

-- System Auth tables also enforce RLS; permit only this JWT's user/session.
create policy studyflow_live_user on auth.users for select to studyflow_api
  using (id = (select auth.uid()));
create policy studyflow_live_session on auth.sessions for select to studyflow_api
  using (user_id = (select auth.uid()) and id::text = (select auth.jwt()->>'session_id'));

create table app_data.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (display_name = btrim(display_name) and char_length(display_name) <= 80),
  locale text not null default 'ru' check (locale in ('ru', 'en')),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table private.account_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'deleting')),
  revision bigint not null default 0 check (revision >= 0)
);
alter table app_data.profiles enable row level security;
alter table app_data.profiles force row level security;
alter table private.account_state enable row level security;
alter table private.account_state force row level security;
create policy own_profile on app_data.profiles to studyflow_api
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy own_account on private.account_state to studyflow_api
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on app_data.profiles, private.account_state from public, anon, authenticated;
grant select, insert, update on app_data.profiles, private.account_state to studyflow_api;

create function private.require_live_user() returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid();
begin
  if v_user is null or not exists (
    select 1 from auth.users u join auth.sessions s on s.user_id = u.id
    where u.id = v_user and s.id::text = (auth.jwt() ->> 'session_id')
      and u.email_confirmed_at is not null and u.deleted_at is null
      and (u.banned_until is null or u.banned_until <= now())
      and (s.not_after is null or s.not_after > now())
  ) then raise exception 'authentication_required' using errcode = '28000'; end if;
  return v_user;
end $$;

create function api.profile() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_user uuid := private.require_live_user(); v_status text; v_result jsonb;
begin
  insert into private.account_state (user_id) values (v_user) on conflict do nothing;
  select status into v_status from private.account_state where user_id = v_user for update;
  if v_status <> 'active' then raise exception 'account_inactive' using errcode = '42501'; end if;
  insert into app_data.profiles (user_id) values (v_user) on conflict do nothing;
  select jsonb_build_object('user_id', user_id, 'display_name', display_name, 'locale', locale,
    'version', version::text, 'created_at', created_at, 'updated_at', updated_at)
    into v_result from app_data.profiles where user_id = v_user;
  return v_result;
end $$;

create function api.update_profile(p_display_name text, p_expected_version text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_user uuid := private.require_live_user();
begin
  if p_display_name is null or char_length(btrim(p_display_name)) > 80
    or p_expected_version is null or p_expected_version !~ '^[1-9][0-9]{0,17}$'
    then raise exception 'invalid_profile' using errcode = '22023'; end if;
  perform api.profile(); -- Validates active account and locks its revision row.
  update app_data.profiles set display_name = btrim(p_display_name), version = version + 1, updated_at = now()
    where user_id = v_user and version = p_expected_version::bigint;
  if not found then raise exception 'profile_conflict' using errcode = '40001'; end if;
  update private.account_state set revision = revision + 1 where user_id = v_user;
  return api.profile();
end $$;

grant studyflow_api to postgres;
grant create on schema private, api to studyflow_api;
alter function private.require_live_user() owner to studyflow_api;
alter function api.profile() owner to studyflow_api;
alter function api.update_profile(text, text) owner to studyflow_api;
revoke all on function private.require_live_user(), api.profile(), api.update_profile(text, text) from public, anon, authenticated;
grant execute on function api.profile(), api.update_profile(text, text) to authenticated;

revoke create on schema private, api from studyflow_api;
revoke studyflow_api from postgres;
