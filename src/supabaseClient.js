import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Ayuda a detectar rápido si faltan las variables de entorno al desplegar.
  console.error(
    'Faltan las variables VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
      'Copiá .env.example a .env y completá con las claves de tu proyecto Supabase.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
