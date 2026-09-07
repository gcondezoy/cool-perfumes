-- =============================================================
--  COOL PERFUMES — Orden manual del catálogo
--  Ejecútalo UNA VEZ en: Supabase -> SQL Editor -> New query -> Run
--  Es seguro correrlo aunque ya exista (no duplica ni borra nada).
--
--  Cómo funciona:
--    Cada perfume guarda un número de orden. El catálogo se muestra
--    de menor a mayor, así que el 10 sale antes que el 20.
--
--    vacío (null) = producto nuevo, aparece PRIMERO hasta que se
--                   ordene a mano desde el panel.
--
--  El panel escribe estos números solo cuando usas las flechas de
--  ordenar; editar un producto nunca cambia su posición.
-- =============================================================

alter table public.productos
  add column if not exists orden integer;

-- Los productos que ya existen conservan el orden que tenían hasta hoy
-- (los más nuevos primero). Se numera de 10 en 10 para dejar hueco.
-- El "where orden is null" hace que esto no pise un orden ya guardado
-- si vuelves a ejecutar el archivo.
with numerados as (
  select id, (row_number() over (order by creado_en desc)) * 10 as posicion
  from public.productos
  where orden is null
)
update public.productos p
set orden = numerados.posicion
from numerados
where p.id = numerados.id;

create index if not exists productos_orden_idx
  on public.productos (orden);
