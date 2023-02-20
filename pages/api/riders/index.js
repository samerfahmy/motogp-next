// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "./../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { data: riders, error } = await supabase
    .from("riders")
    .select("*")
    .order("name", { ascending: true });

  if (!error) {
    res.status(200).json(riders);
    return;
  }

  res.status(400).json({
    error: error,
  });
}
