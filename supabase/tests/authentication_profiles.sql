begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(19);

insert into auth.users (id, email, email_confirmed_at) values
  ('10000000-0000-4000-8000-000000000001', 'rls-one@studyflow.test', now()),
  ('10000000-0000-4000-8000-000000000002', 'rls-two@studyflow.test', now()),
  ('10000000-0000-4000-8000-000000000003', 'unconfirmed@studyflow.test', null);
insert into auth.sessions (id, user_id) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003');
select ok(not has_schema_privilege('authenticated', 'app_data', 'usage'), 'Client cannot access private data schema');
select ok(not has_table_privilege('authenticated', 'app_data.profiles', 'select,insert,update,delete'), 'No client DML grants');
select ok(not has_function_privilege('anon', 'api.profile()', 'execute'), 'Anonymous RPC denied');
select ok((select not rolsuper and not rolbypassrls and not rolcanlogin from pg_roles where rolname='studyflow_api'), 'RPC owner cannot log in or bypass RLS');
select ok((select relrowsecurity and relforcerowsecurity from pg_class where oid='app_data.profiles'::regclass), 'Profile RLS enabled and forced');
select isnt((select relowner from pg_class where oid='app_data.profiles'::regclass), (select proowner from pg_proc where oid='api.profile()'::regprocedure), 'RPC owner is not table owner');

set local role authenticated;
select throws_ok('select api.profile()', '28000', 'authentication_required', 'Missing claims rejected');
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","session_id":"20000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select is(api.profile()->>'user_id', '10000000-0000-4000-8000-000000000001', 'Profile uses verified session owner');
select is(api.update_profile(' First ', '1')->>'display_name', 'First', 'Update normalizes own name');
select throws_ok($$select api.update_profile('stale', '1')$$, '40001', 'profile_conflict', 'Stale version rejected');
select throws_ok($$select api.update_profile('name', '-1')$$, '22023', 'invalid_profile', 'Malformed version rejected');
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","session_id":"20000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select throws_ok('select api.profile()', '28000', 'authentication_required', 'Another user session cannot authorize caller');
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000003","session_id":"20000000-0000-4000-8000-000000000003","role":"authenticated"}', true);
select throws_ok('select api.profile()', '28000', 'authentication_required', 'Unconfirmed user rejected');
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","session_id":"20000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select is(api.profile()->>'display_name', '', 'Second user does not receive first profile');
reset role;
grant studyflow_api to postgres;
set local role studyflow_api;
select is((select count(*)::int from app_data.profiles), 1, 'RLS hides other users even from RPC owner');
reset role;
update private.account_state set status='deleting' where user_id='10000000-0000-4000-8000-000000000002';
set local role authenticated;
select throws_ok('select api.profile()', '42501', 'account_inactive', 'Deleting account cannot bootstrap or update profile');
reset role;
update auth.sessions set not_after=now()-interval '1 minute' where id='20000000-0000-4000-8000-000000000002';
set local role authenticated;
select throws_ok('select api.profile()', '28000', 'authentication_required', 'Expired session rejected');
reset role;
delete from auth.sessions where id='20000000-0000-4000-8000-000000000001';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","session_id":"20000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select throws_ok('select api.profile()', '28000', 'authentication_required', 'Revoked session JWT cannot read or bootstrap');
reset role;
select is((select count(*)::int from app_data.profiles where user_id='10000000-0000-4000-8000-000000000001'), 1, 'Rejected request leaves profile untouched');
select * from finish();
rollback;
