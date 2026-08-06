-- =============================================================
--  COOL PERFUMES — Decants (3 ml y 5 ml)
--  Ejecútalo UNA VEZ en: Supabase -> SQL Editor -> New query -> Run
--  Es seguro correrlo aunque ya exista (no duplica ni borra nada).
--
--  Cómo funciona: si un perfume tiene precio de decant, aparece en la
--  sección "Decants" de la tienda. Si lo dejas vacío, ese perfume solo
--  se muestra en la sección de perfumes (frasco completo).
-- =============================================================

alter table public.productos
  add column if not exists decant_3ml numeric;

alter table public.productos
  add column if not exists decant_5ml numeric;

-- Nota: la columna decant_10ml ya no se usa (los decants ahora son de
-- 3 ml y 5 ml). Se deja para no perder datos. Si quieres eliminarla:
--   alter table public.productos drop column if exists decant_10ml;
