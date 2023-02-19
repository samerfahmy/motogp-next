// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "./../../lib/supabaseClient";

export default async function handler(req, res) {
  const { data: races, error } = await supabase
    .from("users")
    .select("*")
    .order("username", { ascending: false });

  if (!error) {
    res.status(200).json(races);
  }

  res.status(200).json("success");
}
