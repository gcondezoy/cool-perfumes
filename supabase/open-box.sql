-- =============================================================
--  COOL PERFUMES — Agregar la clasificación "Open Box"
--  Ejecútalo UNA VEZ en: Supabase -> SQL Editor -> New query -> Run
--  Es seguro correrlo aunque ya exista (no duplica ni borra nada).
-- =============================================================

alter table public.productos
  add column if not exists open_box boolean not null default false;
