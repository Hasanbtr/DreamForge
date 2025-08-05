// src/context/auth-context.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  type User as SupabaseUser,
  type Session,
  type WeakPassword
} from "@supabase/supabase-js";
import { type User } from "@/lib/types";
import { addProfile, getProfileById } from "@/lib/data-service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ user: SupabaseUser | null; session: Session | null }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: SupabaseUser | null; session: Session | null; weakPassword?: WeakPassword }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        const userProfile = await getProfileById(sessionData.session.user.id);
        
        if (userProfile) {
          setUser(userProfile);
        } else {
          console.error("Kullanıcı profili bulunamadı, oturum sonlandırılıyor.");
          await supabase.auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const userProfile = await getProfileById(session.user.id);
          if (userProfile) {
            setUser(userProfile);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { name } }
    });
    if (error) {
      throw error;
    }
    if (data.user) {
        await addProfile(
            data.user.id,
            name,
            email
        );
    }
    
    return data;
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    return data;
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, signup, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}