import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Reemplaza estas variables con los valores reales de tu proyecto de Supabase
export const SUPABASE_URL = 'https://ogklogmlsoktyqcfpjha.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_oJQGKZc5GTzaHK2fJTVtCQ_EDZpZFZf';

// Cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
