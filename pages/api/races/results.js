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
  console.log(string);
  return string;
}

export default async function handler(req, res) {
  const race_prediction = req.body;
  console.log(race_prediction);

  // const token = await getToken({ req });
  // console.log(token);
  // console.log(token.user.isAdmin);

  const prediction = {
    pole_position: sanitize(race_prediction.pole_position),
    sprint_race_pos_1: sanitize(race_prediction.sprint_race_pos_1),
    sprint_race_pos_2: sanitize(race_prediction.sprint_race_pos_2),
    sprint_race_pos_3: sanitize(race_prediction.sprint_race_pos_3),
    sprint_race_fastest_lap: sanitize(race_prediction.sprint_race_fastest_lap),
    race_pos_1: sanitize(race_prediction.race_pos_1),
    race_pos_2: sanitize(race_prediction.race_pos_2),
    race_pos_3: sanitize(race_prediction.race_pos_3),
    race_fastest_lap: sanitize(race_prediction.race_fastest_lap),
  }

  const { error } = await supabase
    .from("races")
    .update(prediction)
    .eq("id", race_prediction.race_id);

  console.log(error);

  res.status(200).json("success");
}
