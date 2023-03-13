// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "./../../../lib/supabaseClient";
import { getToken } from "next-auth/jwt";

const sanitize = (string) => {
  if (string != null) {
    string = string.trim();
    if (string.length == 0) {
      string = null;
    }
  }
  if (string === undefined) {
    string = null;
  }
  return string;
};

export default async function handler(req, res) {
  const race_result = req.body;
  const token = await getToken({ req });

  if (req.method != "POST") {
    res.status(400).json("error posting results");
    return;
  }

  if (!token.user.isAdmin) {
    res.status(400).json("unauthorized");
    return;
  }

  const result = {
    pole_position: sanitize(race_result.pole_position),
    sprint_race_pos_1: sanitize(race_result.sprint_race_pos_1),
    sprint_race_pos_2: sanitize(race_result.sprint_race_pos_2),
    sprint_race_pos_3: sanitize(race_result.sprint_race_pos_3),
    sprint_race_fastest_lap: sanitize(race_result.sprint_race_fastest_lap),
    race_pos_1: sanitize(race_result.race_pos_1),
    race_pos_2: sanitize(race_result.race_pos_2),
    race_pos_3: sanitize(race_result.race_pos_3),
    race_fastest_lap: sanitize(race_result.race_fastest_lap),
  };

  const { error } = await supabase
    .from("races")
    .update(result)
    .eq("id", race_result.race_id);

  if (error) {
    console.log(error);
    res.status(400).json("error storing results");
    return;
  }

  res.status(200).json("success");
}
