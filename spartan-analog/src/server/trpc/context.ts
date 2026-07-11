import { db } from '../db';
import { createServerSupabaseClient } from '../lib/supabase';

export function createContext() {
  return {
    db,
    supabase: createServerSupabaseClient(),
  };
}

export type Context = ReturnType<typeof createContext>;
