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

-- Les nouveaux projets Supabase ne donnent plus de droits par défaut au rôle public : on autorise seulement lire et ajouter.
grant select, insert on public.scores to anon;
grant usage, select on sequence public.scores_id_seq to anon;

-- ---------------------------------------------------------------------------
-- Commentaires des joueurs (section en bas du menu). À exécuter une fois, comme ci-dessus.
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 20),
  message text not null check (char_length(message) between 3 and 600),
  scenario text check (scenario is null or char_length(scenario) <= 20),
  rating smallint check (rating is null or rating between 1 and 5),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists comments_recent on public.comments (created_at desc);

-- Tout le monde peut lire les commentaires visibles et en publier un ; personne ne peut modifier ni effacer.
-- Pour masquer un message : Table Editor › comments › mettre « hidden » à true (ou supprimer la ligne).
alter table public.comments enable row level security;
drop policy if exists "lecture publique" on public.comments;
create policy "lecture publique" on public.comments for select to anon using (hidden = false);
drop policy if exists "ajout public" on public.comments;
create policy "ajout public" on public.comments for insert to anon with check (hidden = false);

grant select (name, message, scenario, rating, hidden, created_at) on public.comments to anon;
grant insert (name, message, scenario, rating) on public.comments to anon;
grant usage, select on sequence public.comments_id_seq to anon;
