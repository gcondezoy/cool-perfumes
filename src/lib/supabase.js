// =============================================================
//  CLIENTE DE SUPABASE
//  Lee las credenciales de las variables de entorno de Vite.
//  Crea un archivo ".env.local" en la raíz del proyecto con:
//
//    VITE_SUPABASE_URL=https://xxxxx.supabase.co
//    VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
//
//  Si no están configuradas, la app sigue funcionando en "modo local"
//  (los productos se guardan en el navegador).
// =============================================================

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigurado = Boolean(url && anonKey)

export const supabase = supabaseConfigurado ? createClient(url, anonKey) : null

// Nombre del bucket de Storage donde se suben las fotos de producto.
export const BUCKET_IMAGENES = 'productos'
