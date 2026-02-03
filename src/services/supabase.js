import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://osenoeniqmjuhmwxbbtu.supabase.co";
const supabaseKey = "sb_publishable_4qk2RYErh5DrILEX8ZKpWA_s982i6tK";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
