import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aqitmalabxzayduejpxp.supabase.co';
// Вставь свой длинный ключ между одинарными кавычками ниже!
const supabaseAnonKey = 'sb_publishable_q5zptuNMgrb9TYo1JNOKOg_Wsfkd4SK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);