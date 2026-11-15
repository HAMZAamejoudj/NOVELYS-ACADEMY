-- =====================================================================
-- NOVELYS ACADEMY - Schéma de Base de Données Supabase (PostgreSQL)
-- =====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLE: PROFESSEURS
create table if not exists public.professeurs (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  telephone text not null,
  email text,
  matieres text[] not null default '{}',
  pourcentage numeric(5,2) not null default 50.00 check (pourcentage >= 0 and pourcentage <= 100),
  experience text,
  statut text not null default 'actif' check (statut in ('actif', 'inactif')),
  created_at timestamptz not null default now()
);

-- 3. TABLE: SALLES
create table if not exists public.salles (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  etage text not null default '1er Étage',
  capacite integer not null default 20 check (capacite > 0),
  equipements text[] not null default '{}',
  statut text not null default 'disponible' check (statut in ('disponible', 'occupee', 'maintenance')),
  created_at timestamptz not null default now()
);

-- 4. TABLE: GROUPES
create table if not exists public.groupes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  matiere text not null,
  niveau text not null,
  professeur_id uuid references public.professeurs(id) on delete set null,
  salle_defaut_id uuid references public.salles(id) on delete set null,
  tarif_mensuel numeric(10,2) not null default 400.00 check (tarif_mensuel >= 0),
  capacite_max integer not null default 20 check (capacite_max > 0),
  statut text not null default 'ouvert' check (statut in ('ouvert', 'complet', 'ferme')),
  horaires jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 5. TABLE: ETUDIANTS
create table if not exists public.etudiants (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  telephone text not null,
  telephone_parent text not null,
  niveau text not null,
  date_inscription date not null default current_date,
  statut text not null default 'actif' check (statut in ('actif', 'inactif', 'suspendu')),
  notes text,
  created_at timestamptz not null default now()
);

-- 6. JUNCTION TABLE: ETUDIANT_GROUPES
create table if not exists public.etudiant_groupes (
  id uuid primary key default gen_random_uuid(),
  etudiant_id uuid not null references public.etudiants(id) on delete cascade,
  groupe_id uuid not null references public.groupes(id) on delete cascade,
  date_affectation timestamptz not null default now(),
  unique (etudiant_id, groupe_id)
);

-- 7. TABLE: PAIEMENTS
create table if not exists public.paiements (
  id uuid primary key default gen_random_uuid(),
  etudiant_id uuid not null references public.etudiants(id) on delete cascade,
  groupe_id uuid references public.groupes(id) on delete set null,
  mois text not null,
  montant numeric(10,2) not null check (montant >= 0),
  date_paiement date,
  mode_paiement text not null default 'especes' check (mode_paiement in ('especes', 'virement', 'cheque')),
  statut text not null default 'paye' check (statut in ('paye', 'en_retard', 'en_attente')),
  recu_numero text unique not null,
  notes text,
  created_at timestamptz not null default now()
);

-- 8. TABLE: SEANCES
create table if not exists public.seances (
  id uuid primary key default gen_random_uuid(),
  groupe_id uuid not null references public.groupes(id) on delete cascade,
  professeur_id uuid references public.professeurs(id) on delete set null,
  salle_id uuid references public.salles(id) on delete set null,
  jour text not null,
  date_seance date not null default current_date,
  heure_debut text not null,
  heure_fin text not null,
  statut text not null default 'a_venir' check (statut in ('en_cours', 'a_venir', 'terminee', 'annulee')),
  created_at timestamptz not null default now()
);

-- 9. TABLE: PRESENCES
create table if not exists public.presences (
  id uuid primary key default gen_random_uuid(),
  seance_id uuid not null references public.seances(id) on delete cascade,
  etudiant_id uuid not null references public.etudiants(id) on delete cascade,
  statut text not null default 'present' check (statut in ('present', 'absent', 'retard')),
  remarque text,
  created_at timestamptz not null default now(),
  unique (seance_id, etudiant_id)
);

-- 10. TABLE: CENTRE_SETTINGS
create table if not exists public.centre_settings (
  id uuid primary key default gen_random_uuid(),
  nom text not null default 'Novelys Academy',
  telephone text not null default '0537-889900',
  adresse text not null default 'Avenue Hassan II, Rabat',
  annee_scolaire text not null default '2026/2027',
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- INDEXES DE PERFORMANCE
-- =====================================================================
create index if not exists idx_groupes_professeur on public.groupes(professeur_id);
create index if not exists idx_groupes_salle on public.groupes(salle_defaut_id);
create index if not exists idx_etudiant_groupes_etudiant on public.etudiant_groupes(etudiant_id);
create index if not exists idx_etudiant_groupes_groupe on public.etudiant_groupes(groupe_id);
create index if not exists idx_paiements_etudiant on public.paiements(etudiant_id);
create index if not exists idx_paiements_mois on public.paiements(mois);
create index if not exists idx_seances_groupe on public.seances(groupe_id);
create index if not exists idx_seances_date on public.seances(date_seance);
create index if not exists idx_presences_seance on public.presences(seance_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
alter table public.professeurs enable row level security;
alter table public.salles enable row level security;
alter table public.groupes enable row level security;
alter table public.etudiants enable row level security;
alter table public.etudiant_groupes enable row level security;
alter table public.paiements enable row level security;
alter table public.seances enable row level security;
alter table public.presences enable row level security;
alter table public.centre_settings enable row level security;

-- Policies for Authenticated Users (Staff & Admin of Novelys Academy)
create policy "Allow authenticated full access to professeurs" on public.professeurs
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated full access to salles" on public.salles
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated full access to groupes" on public.groupes
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated full access to etudiants" on public.etudiants
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated full access to etudiant_groupes" on public.etudiant_groupes
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated full access to paiements" on public.paiements
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated full access to seances" on public.seances
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated full access to presences" on public.presences
  for all to authenticated using (true) with check (true);

create policy "Allow authenticated full access to centre_settings" on public.centre_settings
  for all to authenticated using (true) with check (true);

-- Allow anon read-only access where needed for public portal or initial load
create policy "Allow anon read access to salles" on public.salles
  for select to anon using (true);

create policy "Allow anon read access to centre_settings" on public.centre_settings
  for select to anon using (true);
