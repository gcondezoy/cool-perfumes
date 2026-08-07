-- =============================================================
--  COOL PERFUMES — Decants (5 ml y 10 ml)
--  Ejecútalo UNA VEZ en: Supabase -> SQL Editor -> New query -> Run
--  Es seguro correrlo aunque ya exista (no duplica ni borra nada).
--
--  Cómo funciona: si un perfume tiene precio de decant, aparece en la
--  sección "Decants" de la tienda. Si lo dejas vacío, ese perfume solo
--  se muestra en la sección de perfumes (frasco completo).
-- =============================================================

alter table public.productos
  add column if not exists decant_5ml numeric;

alter table public.productos
  add column if not exists decant_10ml numeric;
