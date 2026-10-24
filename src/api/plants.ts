import { supabase } from './supabase';

export interface Plant {
  id: string;
  name: string;
  species: string;
  created_at: string;
  owner_id?: string;
}

export async function getPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Plant[];
}