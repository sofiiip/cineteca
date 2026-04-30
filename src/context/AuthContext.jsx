import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

/**
 * Provee la sesión de Supabase a toda la app y expone los métodos de auth.
 * Escucha los cambios de sesión (login / logout / refresh de token).
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sesión inicial (por si el usuario ya estaba logueado).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Suscripción a cambios de sesión.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
