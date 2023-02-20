// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "./../../../lib/supabaseClient";
import { getToken } from "next-auth/jwt";

const postPrediction = async (req, res) => {
  console.log("postPrediction");

  const token = await getToken({ req });
  const user = token.user;

  const prediction = req.body;

  console.log(JSON.stringify(prediction));

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
  console.log("getPredictionForUser(%s, %s)", user, race);

  const { data: predictions, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user)
    .eq("race_id", race)
    .order("race_id", { ascending: true });

  console.log("getPredictionForUser" + JSON.stringify(predictions));

  return {
    predictions,
    error,
  };
};

const getAllPredictionsForUser = async (user) => {
  console.log("getAllPredictionsForUser(%s)", user);

  const { data: predictions, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user)
    .order("race_id", { ascending: true });

  console.log("getAllPredictionsForUser" + JSON.stringify(predictions));

  return {
    predictions,
    error,
  };
};

const getAllPredictions = async () => {
  console.log("getAllPredictions");

  const { data: predictions, error } = await supabase
    .from("predictions")
    .select("*")
    .order("race_id", { ascending: true });

  console.log("getAllPredictions" + JSON.stringify(predictions));

  return {
    predictions,
    error,
  };
};

export default async function handler(req, res) {
  console.log("/predictions");

  if (req.method == "POST") {
    const error = await postPrediction(req, res);
    if (error) {
      res.status(400).json("error");
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

  // console.log(JSON.stringify(query));
  // console.log("user: " + user);
  // console.log("race: " + race);

  if (returnVal.error) {
    res.status(400).json("error");
  }

  res.status(200).json(returnVal.predictions);
}
