-- =============================================================
--  COOL PERFUMES — Decants (3 ml, 5 ml y 10 ml) y perfumes solo en decant
--  Ejecútalo en: Supabase -> SQL Editor -> New query -> Run
--  Es seguro correrlo aunque ya lo hayas corrido antes: solo agrega
--  lo que falte, no duplica ni borra nada.
--
--  Cómo funciona:
--    decant_3ml / decant_5ml / decant_10ml
--      Precio de cada medida. Si un perfume tiene al menos uno, aparece
--      en la sección "Decants" de la tienda. Vacío = no se vende esa medida.
--
--    solo_decant
--      true  = el perfume NO se vende en frasco: no aparece en La
--              colección, solo en la sección de decants. Su precio de
--              frasco y su stock se ignoran.
--      false = frasco completo (lo normal).
--
--    orden_decant
--      Orden de la sección Decants, INDEPENDIENTE del de La colección
--      (columna "orden"). Lo escribe el panel, pestaña Decants.
--      vacío (null) = producto nuevo, aparece primero.
-- =============================================================

alter table public.productos
  add column if not exists decant_3ml numeric;

alter table public.productos
  add column if not exists decant_5ml numeric;

alter table public.productos
  add column if not exists decant_10ml numeric;

alter table public.productos
  add column if not exists solo_decant boolean not null default false;

alter table public.productos
  add column if not exists orden_decant integer;

-- Hasta hoy la sección Decants usaba el mismo orden que La colección.
-- Se copia ese orden como punto de partida, así nada cambia de sitio
-- al correr este archivo. El "where orden_decant is null" evita pisar
-- un orden de Decants ya guardado si lo vuelves a ejecutar.
update public.productos
set orden_decant = orden
where orden_decant is null
  and orden is not null;

create index if not exists productos_orden_decant_idx
  on public.productos (orden_decant);
