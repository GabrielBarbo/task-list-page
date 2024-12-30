import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rnfssftradakbuypwyad.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZnNzZnRyYWRha2J1eXB3eWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MjE3ODMsImV4cCI6MjA1MTA5Nzc4M30.fru4roZKyJeNT7JBF4guqy2IH9AbDTomULHhHwuVGHs";

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
