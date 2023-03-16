// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "./../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { data: races, error } = await supabase
    .from("races")
    .select("*")
    .limit(1);

  if (!error) {
    res.status(200).json({success: true});
    return;
  }

  res.status(400).json({
    error: "db error",
  });
}
