-- Table du classement des Chambres Secrètes (à exécuter une fois dans Supabase › SQL Editor).
create table if not exists public.scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 20),
  scenario text not null check (char_length(scenario) <= 20),
  level smallint not null check (level between 0 and 2),
  seconds integer not null check (seconds between 1 and 3600),
  hints smallint not null default 0 check (hints between 0 and 20),
  created_at timestamptz not null default now()
);

create index if not exists scores_rank on public.scores (scenario, level, seconds, hints);

-- Tout le monde peut lire le classement et y ajouter un score, mais personne ne peut modifier ni effacer.
alter table public.scores enable row level security;
drop policy if exists "lecture publique" on public.scores;
create policy "lecture publique" on public.scores for select to anon using (true);
drop policy if exists "ajout public" on public.scores;
create policy "ajout public" on public.scores for insert to anon with check (true);
