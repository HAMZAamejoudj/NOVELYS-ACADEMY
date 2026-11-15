import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://nvzvktpngsqzxecsryhe.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_t7P_rwRT4sPsTXtMg1zjOg_asdse8oZ';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(url, anonKey);
}
