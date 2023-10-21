// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "./../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { data: races, races_error } = await supabase
    .from("races")
    .select("*")
    .order("race_start_time", { ascending: true });

  const { data: predictions, predictions_error } = await supabase
    .from("predictions")
    .select("*");

  const { data: users, users_error } = await supabase
    .from("users")
    .select("*")
    .neq("test", true);

  if (races_error || predictions_error || users_error) {
    res.status(400).json("error");
    return;
  }

  let response = {};

  const hash = (srcData) => {
    var data = srcData.toString();
    var hash = 0,
      i,
      chr;
    if (data.length === 0) return hash;
    for (i = 0; i < data.length; i++) {
      chr = data.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  var processed_race_results = {};
  var race_list = [];
  for (var i = 0; i < races.length; i++) {
    var race = races[i];
    var race_data = {
      race_id: race.id,
      location: race.location,
      pole_position: race.pole_position,
      sprint_race_pos_1: race.sprint_race_pos_1,
      sprint_race_pos_2: race.sprint_race_pos_2,
      sprint_race_pos_3: race.sprint_race_pos_3,
      sprint_race_fastest_lap: race.sprint_race_fastest_lap,
      race_pos_1: race.race_pos_1,
      race_pos_2: race.race_pos_2,
      race_pos_3: race.race_pos_3,
      race_fastest_lap: race.race_fastest_lap,
      qualification_completed: race.pole_position != null,
      qualification_started: new Date(race.qualifying_start_time) < Date.now(),
      sprint_race_completed: race.sprint_race_pos_1 != null,
      sprint_race_started: new Date(race.sprint_race_start_time) < Date.now(),
      race_completed: race.race_pos_1 != null,
      race_started: new Date(race.race_start_time) < Date.now(),
      skip_race: race.skip_race,
      skip_sprint: race.skip_sprint,
      skip_pole: race.skip_pole,
    };

    processed_race_results[race.id] = race_data;
    race_list.push(race_data);
  }

  var processed_users = {};
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    user.hashed_id = hash(user.id);
    processed_users[user.hashed_id] = {
      total: 0,
      name: user.name,
      races: {},
    };
  }

  for (var i = 0; i < predictions.length; i++) {
    var prediction = predictions[i];

    var race_id = prediction.race_id;
    var user_id = hash(prediction.user_id);
    var race_result = processed_race_results[race_id];
    if (race_result) {
      var calculated_score = 0;

      var prediction_data = {};

      if (race_result.qualification_started) {
        prediction_data.pole_position = prediction.pole_position;
      }

      if (race_result.qualification_completed && !race.skip_pole) {
        calculated_score +=
          race_result.pole_position == prediction.pole_position &&
          race_result.pole_position !== null
            ? 2
            : 0;
      }

      if (race_result.sprint_race_started) {
        prediction_data.sprint_race_pos_1 = prediction.sprint_race_pos_1;
        prediction_data.sprint_race_pos_2 = prediction.sprint_race_pos_2;
        prediction_data.sprint_race_pos_3 = prediction.sprint_race_pos_3;
        prediction_data.sprint_race_fastest_lap =
          prediction.sprint_race_fastest_lap;
      }

      if (race_result.sprint_race_completed && !race_result.skip_sprint) {
        var winners = {};
        winners[race_result.sprint_race_pos_1] = true;
        winners[race_result.sprint_race_pos_2] = true;
        winners[race_result.sprint_race_pos_3] = true;
        winners[null] = false;

        if (winners[prediction.sprint_race_pos_1]) {
          calculated_score +=
            prediction.sprint_race_pos_1 == race_result.sprint_race_pos_1
              ? 2
              : 1;
        }

        if (winners[prediction.sprint_race_pos_2]) {
          calculated_score +=
            prediction.sprint_race_pos_2 == race_result.sprint_race_pos_2
              ? 2
              : 1;
        }

        if (winners[prediction.sprint_race_pos_3]) {
          calculated_score +=
            prediction.sprint_race_pos_3 == race_result.sprint_race_pos_3
              ? 2
              : 1;
        }

        if (
          prediction.sprint_race_fastest_lap ==
            race_result.sprint_race_fastest_lap &&
          race_result.sprint_race_fastest_lap !== null
        ) {
          calculated_score += 1;
        }
      }

      if (race_result.race_started) {
        prediction_data.race_pos_1 = prediction.race_pos_1;
        prediction_data.race_pos_2 = prediction.race_pos_2;
        prediction_data.race_pos_3 = prediction.race_pos_3;
        prediction_data.race_fastest_lap = prediction.race_fastest_lap;
      }

      if (race_result.race_completed && !race_result.skip_race) {
        var winners = {};
        winners[race_result.race_pos_1] = true;
        winners[race_result.race_pos_2] = true;
        winners[race_result.race_pos_3] = true;
        winners[null] = false;

        if (winners[prediction.race_pos_1]) {
          calculated_score +=
            prediction.race_pos_1 == race_result.race_pos_1 ? 4 : 2;
        }

        if (winners[prediction.race_pos_2]) {
          calculated_score +=
            prediction.race_pos_2 == race_result.race_pos_2 ? 4 : 2;
        }

        if (winners[prediction.race_pos_3]) {
          calculated_score +=
            prediction.race_pos_3 == race_result.race_pos_3 ? 4 : 2;
        }

        if (
          prediction.race_fastest_lap == race_result.race_fastest_lap &&
          race_result.race_fastest_lap !== null
        ) {
          calculated_score += 1;
        }
      }

      prediction_data.score = calculated_score;

      if (processed_users[user_id]) {
        processed_users[user_id].races[race_id] = prediction_data;
        processed_users[user_id].total += calculated_score;
      }
    }
  }

  var sorted_user_id_tuples = Object.keys(processed_users).map(function (key) {
    return [key, processed_users[key].total];
  });
  sorted_user_id_tuples.sort(function (first, second) {
    return second[1] - first[1];
  });

  var sorted_user_ids = [];
  for (var i = 0; i < sorted_user_id_tuples.length; i++) {
    sorted_user_ids.push(sorted_user_id_tuples[i][0]);
  }

  response.user_ids = sorted_user_ids;
  response.user_data = processed_users;
  response.races = race_list;

  res.status(200).json(response);
}
