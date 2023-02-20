import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import moment from "moment";

const Calendar = () => {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setRaces([]);
      const races = await (await fetch("/api/races")).json();
      const predictions = await (await fetch("/api/predictions?user=")).json();

      for (var i = 0; i < races.length; i++) {
        for (var j = 0; j < predictions.length; j++) {
          const prediction = predictions[j];
          if (prediction.race_id == races[i].id) {
            races[i].prediction = prediction;
          }
        }
      }

      setRaces(races);
    };
    fetchData();
  }, []);

  const TableRow = ({ title, result, prediction }) => {
    return (
      <>
        <tr>
          <td>
            <p>Pole position</p>
          </td>
          <td>
            <p>{result}</p>
          </td>
          <td>
            <p>{prediction}</p>
          </td>
        </tr>
      </>
    );
  };

  const CalendarItem = ({ race }) => {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>{race.location}</Card.Title>
            <Card.Text>
              <span className="fw-light">
                <small>
                  Qualifying on{" "}
                  {moment(race.qualifying_start_time).format(
                    "dddd, MMMM Do, h:mm a"
                  )}
                </small>
              </span>
              <br></br>
              <span>
                Sprint race on{" "}
                {moment(race.sprint_race_start_time).format(
                  "dddd, MMMM Do, h:mm a"
                )}
              </span>
              <br></br>
              <span>
                Race on{" "}
                {moment(race.race_start_time).format("dddd, MMMM Do, h:mm a")}
              </span>
              <table>
                <tbody>
                  <tr>
                    <td></td>
                    <td>Result</td>
                    <td>Prediction</td>
                  </tr>
                  <TableRow
                    title="Pole position"
                    result={race.pole_position}
                    prediction={race.prediction?.pole_position}
                  />
                  <TableRow
                    title="Sprint first"
                    result={race.sprint_race_pos_1}
                    prediction={race.prediction?.sprint_race_pos_1}
                  />
                  <TableRow
                    title="Sprint second"
                    result={race.sprint_race_pos_2}
                    prediction={race.prediction?.sprint_race_pos_2}
                  />
                  <TableRow
                    title="Sprint third"
                    result={race.sprint_race_pos_3}
                    prediction={race.prediction?.sprint_race_pos_3}
                  />
                  <TableRow
                    title="Sprint fastest lap"
                    result={race.sprint_fastest_lap}
                    prediction={race.prediction?.sprint_fastest_lap}
                  />
                  <TableRow
                    title="Race first"
                    result={race.race_pos_1}
                    prediction={race.prediction?.race_pos_1}
                  />
                  <TableRow
                    title="Race first"
                    result={race.race_pos_2}
                    prediction={race.prediction?.race_pos_2}
                  />
                  <TableRow
                    title="Race first"
                    result={race.race_pos_3}
                    prediction={race.prediction?.race_pos_3}
                  />
                  <TableRow
                    title="Race fastest lap"
                    result={race.race_fastest_lap}
                    prediction={race.prediction?.race_fastest_lap}
                  />
                </tbody>
              </table>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    );
  };

  return (
    <>
      <Container>
        <h1>Calendar</h1>
        {races.map((race) => {
          return <CalendarItem key={race.id} race={race} />;
        })}
      </Container>
    </>
  );
};

export default Calendar;
