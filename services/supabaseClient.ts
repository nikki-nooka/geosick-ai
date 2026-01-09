
import { createClient } from '@supabase/supabase-js';

// Project URL: https://xrtdygdqviaoouodwzsv.supabase.co
const supabaseUrl = 'https://xrtdygdqviaoouodwzsv.supabase.co';
// API Key: sb_publishable_UA3uvt4AMu1u2o5BSag7pQ_KVvl2RG9
const supabaseAnonKey = 'sb_publishable_UA3uvt4AMu1u2o5BSag7pQ_KVvl2RG9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
