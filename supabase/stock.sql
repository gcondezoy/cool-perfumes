-- =============================================================
--  COOL PERFUMES — Control de stock
--  Ejecútalo UNA VEZ en: Supabase -> SQL Editor -> New query -> Run
--  Es seguro correrlo aunque ya exista (no duplica ni borra nada).
--
--  Cómo funciona:
--    vacío (null) = sin control de stock (se puede pedir sin límite)
--    0            = agotado (se muestra en gris, no se puede comprar)
--    1 o más      = unidades disponibles; el cliente no puede pedir más
-- =============================================================

alter table public.productos
  add column if not exists stock integer;
