import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bewelbotjvssodukvhiq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJld2VsYm90anZzc29kdWt2aGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NTM3NzMsImV4cCI6MjA3NTUyOTc3M30.wynKhNciuV4x8u1YWdH2q4HsrTPDt75ObF2JRheYdXA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
