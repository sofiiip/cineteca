-- ============================================================
--  Cineteca · Esquema de la base de datos (Supabase / PostgreSQL)
--  Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Tabla principal: cada fila es un título de la watchlist de un usuario.
create table if not exists public.titles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  type        text not null default 'pelicula' check (type in ('pelicula', 'serie')),
  year        int,
  status      text not null default 'pendiente' check (status in ('pendiente', 'viendo', 'vista')),
  rating      int  not null default 0 check (rating between 0 and 5),
  review      text,
  created_at  timestamptz not null default now()
);

-- Índice para listar rápido los títulos de un usuario.
create index if not exists titles_user_id_idx on public.titles (user_id);

-- ============================================================
--  Row Level Security: cada usuario sólo ve y modifica lo suyo.
-- ============================================================
alter table public.titles enable row level security;

create policy "Los usuarios ven sus propios títulos"
  on public.titles for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean títulos propios"
  on public.titles for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios editan sus propios títulos"
  on public.titles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Los usuarios eliminan sus propios títulos"
  on public.titles for delete
  using (auth.uid() = user_id);
