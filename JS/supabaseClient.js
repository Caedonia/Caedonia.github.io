import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL= 'https://vjbrfvxbwjtncmvxeswb.supabase.co';
const SUPABASE_ANON_KEY= 'sb_publishable_RlsEaUV3JWpRKRBZmai-tg_oJUFAvOA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);