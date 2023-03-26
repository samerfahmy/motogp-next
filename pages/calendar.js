import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
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

  const format = (date) => {
    return moment(date).format("dddd, MMMM Do, h:mm a");
  };

  const TableRow = ({ title, result, prediction }) => {
    const match = result === prediction;

    return (
      <>
        <tr className="table-border-bottom">
          <td className="pe-5 small fw-light">{title}</td>
          <td className="pe-5 small fw-light">{result}</td>
          <td className={"pe-5 small fw-light " + (match ? "green" : "red")}>
            {prediction}
          </td>
        </tr>
      </>
    );
  };

  const ResultsTable = ({ race }) => {
    return (
      <table className="mt-2">
        <tbody>
          <tr className="table-border-bottom">
            <td className="pe-5"></td>
            <td className="pe-5 small fw-bold">Result</td>
            <td className="pe-5 small fw-bold">Prediction</td>
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
            result={race.sprint_race_fastest_lap}
            prediction={race.prediction?.sprint_race_fastest_lap}
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
    );
  };

  const CalendarItem = ({ race }) => {
    return (
      <>
        <Card className="my-2">
          <Card.Body>
            <Card.Title>{race.location}</Card.Title>
            <Card.Body className="py-0 px-0 mx-0 my-0">
              <Row>
                <span className="fw-light small">
                  Qualifying on {format(race.qualifying_start_time)}
                </span>
              </Row>
              <Row>
                <span className="fw-light small">
                  Sprint race on {format(race.sprint_race_start_time)}
                </span>
              </Row>
              <Row>
                <span className="fw-light small">
                  Race on {format(race.race_start_time)}
                </span>
              </Row>
              {new Date(race.qualifying_start_time) < Date.now() ? (
                <ResultsTable race={race} />
              ) : (
                <></>
              )}
            </Card.Body>
          </Card.Body>
        </Card>
      </>
    );
  };

  return (
    <>
      <Container>
        {races.map((race, index) => {
          return <CalendarItem key={index} race={race} />;
        })}
      </Container>
    </>
  );
};

export default Calendar;
