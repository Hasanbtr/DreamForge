// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

// supabaseUrl ve supabaseAnonKey değişkenlerini dışarıya aktarmamız gerekiyor
export const supabaseUrl = "https://ngthanfnmiheipasetil.supabase.co"; 
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ndGhhbmZubWloZWlwYXNldGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMzczMjAsImV4cCI6MjA2OTcxMzMyMH0.7QTjFVWfr4cA-1H_mdkvqBYUNu-q0utDlO3fhE7kvpg";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve anahtarı tanımlanmamış!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);