import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first");
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const users = [
  { email:"student@demo.com", role:"student", first_name:"Demo", last_name:"User", organization:"MapleLeaf Education" },
  { email:"agent@demo.com", role:"agent", first_name:"Demo Agent", last_name:"User", organization:"MapleLeaf Agency" },
  { email:"college@demo.com", role:"college", first_name:"Demo College", last_name:"User", organization:"Maple Ridge College", college_slug:"maple-ridge-college" },
];
for (const item of users) {
  const { role, college_slug, ...profile } = item;
  const { error } = await supabase.auth.admin.createUser({ email:item.email, password:"123456", email_confirm:true, user_metadata:profile, app_metadata:{ role, college_slug } });
  if (error && !error.message.toLowerCase().includes("already")) throw error;
  console.log(`${item.email}: ${error ? "already exists" : "created"}`);
}
