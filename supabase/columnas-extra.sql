-- =============================================================
--  COOL PERFUMES — Columnas extra de productos
--  Ejecútalo UNA VEZ en: Supabase -> SQL Editor -> New query -> Run
--  Es seguro correrlo aunque ya exista alguna (no duplica ni borra nada).
-- =============================================================

-- Clasificación "Open Box" (caja abierta / tester)
alter table public.productos
  add column if not exists open_box boolean not null default false;

-- Estado "Agotado" (sin stock: no se puede agregar al carrito, sí consultar)
alter table public.productos
  add column if not exists agotado boolean not null default false;
