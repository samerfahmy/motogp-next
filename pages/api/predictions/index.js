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
  return string;
};

const checkForDuplicate = (prediction) => {
  var selectionsArray = [];
  selectionsArray[0] = this.checkForEmpty(prediction.race_pos_1);
  selectionsArray[1] = this.checkForEmpty(prediction.race_pos_2);
  selectionsArray[2] = this.checkForEmpty(prediction.race_pos_3);

  for (var i = 0; i < selectionsArray.length; i++) {
    for (var j = 0; j < selectionsArray.length; j++) {
      if (
        i != j &&
        selectionsArray[i] === selectionsArray[j] &&
        selectionsArray[i] != null
      ) {
        // duplicate selection, return an error
        return true;
      }
    }
  }

  return false;
};

const checkExpired = (date, offset) => {
  if (offset === undefined) {
    offset = 0;
  }

  var srcDateModified = new Date(date);
  srcDateModified.setSeconds(srcDateModified.getSeconds() + offset);

  return srcDateModified <= Date.now();
};

const postPrediction = async (req, res) => {
  const token = await getToken({ req });
  const user = token.user;

  const race_prediction = req.body;

  const { data: races, raceReadError } = await supabase
    .from("races")
    .select("*")
    .eq("id", race_prediction.race_id);

  if (raceReadError || races == null) return error;

  // check if the race times have expired, if so then error
  const race = races[0];

  const prediction = {
    race_id: race_prediction.race_id,
  };

  if (!checkExpired(race.qualifying_start_time)) {
    prediction.pole_position = sanitize(race_prediction.pole_position);
  }

  if (!checkExpired(race.sprint_race_start_time)) {
    prediction.sprint_race_pos_1 = sanitize(race_prediction.sprint_race_pos_1);
    prediction.sprint_race_pos_2 = sanitize(race_prediction.sprint_race_pos_2);
    prediction.sprint_race_pos_3 = sanitize(race_prediction.sprint_race_pos_3);
    prediction.sprint_race_fastest_lap = sanitize(
      race_prediction.sprint_race_fastest_lap
    );
  }

  if (!checkExpired(race.race_start_time)) {
    prediction.race_pos_1 = sanitize(race_prediction.race_pos_1);
    prediction.race_pos_2 = sanitize(race_prediction.race_pos_2);
    prediction.race_pos_3 = sanitize(race_prediction.race_pos_3);
    prediction.race_fastest_lap = sanitize(race_prediction.race_fastest_lap);
  }

  const { error } = await supabase.from("predictions").upsert(
    {
      user_id: user.id,
      ...prediction,
    },
    {
      onConflict: "user_id, race_id",
    }
  );

  return error;
};

const getPredictionForUser = async (user, race) => {
  const { data: predictions, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user)
    .eq("race_id", race)
    .order("race_id", { ascending: true });

  return {
    predictions,
    error,
  };
};

const getAllPredictionsForUser = async (user) => {
  const { data: predictions, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user)
    .order("race_id", { ascending: true });

  return {
    predictions,
    error,
  };
};

const getAllPredictions = async () => {
  const { data: predictions, error } = await supabase
    .from("predictions")
    .select("*")
    .order("race_id", { ascending: true });

  return {
    predictions,
    error,
  };
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    const error = await postPrediction(req, res);
    if (error) {
      res.status(400).json("error");
      return;
    }
    res.status(200).json("success");
    return;
  }

  const query = req.query;
  const { user, race } = query;
  const userDefined = typeof user !== "undefined";
  const raceDefined = typeof race !== "undefined";

  let returnVal = null;

  if (raceDefined) {
    let userId = user;
    if (!userDefined) {
      const token = await getToken({ req });
      userId = token.user.id;
    }

    returnVal = await getPredictionForUser(userId, race);
  } else if (userDefined && !raceDefined) {
    let userId = user;
    if (user.length == 0) {
      const token = await getToken({ req });
      userId = token.user.id;
    }
    returnVal = await getAllPredictionsForUser(userId);
  } else if (!userDefined && !raceDefined) {
    returnVal = await getAllPredictions();
  }

  if (returnVal.error) {
    res.status(400).json("error");
    return;
  }

  res.status(200).json(returnVal.predictions);
}
