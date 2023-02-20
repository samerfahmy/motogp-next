// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "./../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { data: races, error } = await supabase
    .from("races")
    .select("*")
    .order("race_start_time", { ascending: true });

  if (!error) {
    res.status(200).json(races);
    return;
  }

  res.status(400).json({
    error: error,
  });
}
