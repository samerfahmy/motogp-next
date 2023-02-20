import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";

const Predict = () => {
  const [posting, setPosting] = useState(false);
  const [currentRace, setCurrentRace] = useState({});
  const [riders, setRiders] = useState([]);
  const [prediction, setPrediction] = useState({});

  const { data: session } = useSession();

  const checkExpired = (date, offset) => {
    if (offset === undefined) {
      offset = 0;
    }

    var srcDateModified = new Date(date);
    srcDateModified.setSeconds(srcDateModified.getSeconds() + offset);

    return srcDateModified <= Date.now();
  };

  const findAndSetCurrentRace = (raceList) => {
    let currentRace = null;
    for (var i = 0; i < raceList.length; i++) {
      const race = raceList[i];
      if ((!checkExpired(race.race_start_time), 84600)) {
        currentRace = race;
        break;
      }
    }

    if (currentRace == null) {
      currentRace = raceList[raceList.length - 1];
    }

    setCurrentRace(currentRace);

    return currentRace;
  };

  useEffect(() => {
    const fetchData = async () => {
      const races = await (await fetch("/api/races")).json();

      setRiders([]);
      const riders = await (await fetch("/api/riders")).json();
      setRiders(riders);

      const currentRace = findAndSetCurrentRace(races);
      const predictions = await (
        await fetch(`/api/predictions?race=${currentRace.id}`)
      ).json();
      const prediction = predictions[0];
      setPrediction(prediction);
    };
    fetchData();
  }, []);

  const onClick = async () => {
    // setRaces([]);
    // const races = await (await fetch("/api/races")).json();
    // setRaces(races);
    // console.log(races);

    // setRiders([]);
    // const riders = await (await fetch("/api/riders")).json();
    // setRiders(riders);

    // await fetch("/api/predictions?user=1234&race=4567");
    // await fetch("/api/users");
    // await fetch("/api/users/1234");

    await fetch("/api/predictions?user=1&race=1");
    await fetch("/api/predictions?user=1");
    await fetch("/api/predictions?");
    await fetch("/api/predictions");
  };

  const postPrediction = async (event, id) => {
    setPosting(true);
    event.preventDefault();

    const target = event.target;

    const pole_position = target.pole_position.value;
    const sprint_race_pos_1 = target.sprint_race_pos_1.value;
    const sprint_race_pos_2 = target.sprint_race_pos_2.value;
    const sprint_race_pos_3 = target.sprint_race_pos_3.value;
    const sprint_race_fastest_lap = target.sprint_race_fastest_lap.value;
    const race_pos_1 = target.race_pos_1.value;
    const race_pos_2 = target.race_pos_2.value;
    const race_pos_3 = target.race_pos_3.value;
    const race_fastest_lap = target.race_fastest_lap.value;

    const data = JSON.stringify({
      race_id: id,
      pole_position: pole_position,
      sprint_race_pos_1: sprint_race_pos_1,
      sprint_race_pos_2: sprint_race_pos_2,
      sprint_race_pos_3: sprint_race_pos_3,
      sprint_race_fastest_lap: sprint_race_fastest_lap,
      race_pos_1: race_pos_1,
      race_pos_2: race_pos_2,
      race_pos_3: race_pos_3,
      race_fastest_lap: race_fastest_lap,
    });

    fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    setPosting(false);
  };

  const RiderSelection = ({ id, selectedRider, disabled = false }) => {
    return (
      <Form.Select id={id} defaultValue={selectedRider} disabled={disabled}>
        <option key="empty" value=""></option>
        {riders.map((rider) => {
          return (
            <option key={rider.id} value={rider.name}>
              {rider.name}
            </option>
          );
        })}
      </Form.Select>
    );
  };

  const TableRow = ({ title, id, selectedRider, disabled = false, result }) => {
    return (
      <tr>
        <td>{title}</td>
        <td></td>
        <td>
          <RiderSelection
            id={id}
            selectedRider={selectedRider}
            disabled={disabled}
          />
        </td>
        <td>
          <p>{result}</p>
        </td>
      </tr>
    );
  };

  return (
    <>
      <Container>
        <h1>Welcome {session?.user.name}</h1>
        <p>Enter your predictions for the upcoming race below</p>

        <Card>
          <Card.Body>
            <p>{currentRace.location}</p>
            <p>Predict Pole by {currentRace.qualifying_start_time}</p>
            <p>Predict Sprint Race by {currentRace.sprint_race_start_time}</p>
            <p>Predict Race by {currentRace.race_start_time}</p>
            <Form onSubmit={(event) => postPrediction(event, 1)}>
              <table>
                <tbody>
                  <TableRow
                    title="Pole"
                    id="pole_position"
                    selectedRider={prediction.pole_position}
                    disabled={checkExpired(currentRace.qualifying_start_time)}
                    result={currentRace.pole_position}
                  />
                  <TableRow
                    title="Sprint first"
                    id="sprint_race_pos_1"
                    selectedRider={prediction.sprint_race_pos_1}
                    disabled={checkExpired(currentRace.sprint_race_start_time)}
                    result={currentRace.sprint_race_pos_1}
                  />
                  <TableRow
                    title="Sprint second"
                    id="sprint_race_pos_2"
                    selectedRider={prediction.sprint_race_pos_2}
                    disabled={checkExpired(currentRace.sprint_race_start_time)}
                    result={currentRace.sprint_race_pos_2}
                  />
                  <TableRow
                    title="Sprint third"
                    id="sprint_race_pos_3"
                    selectedRider={prediction.sprint_race_pos_3}
                    disabled={checkExpired(currentRace.sprint_race_start_time)}
                    result={currentRace.sprint_race_pos_3}
                  />
                  <TableRow
                    title="Sprint fastest lap"
                    id="sprint_race_fastest_lap"
                    selectedRider={prediction.sprint_race_fastest_lap}
                    disabled={checkExpired(currentRace.sprint_race_start_time)}
                    result={currentRace.sprint_race_fastest_lap}
                  />
                  <TableRow
                    title="Race first"
                    id="race_pos_1"
                    selectedRider={prediction.race_pos_1}
                    disabled={checkExpired(currentRace.race_start_time)}
                    result={currentRace.race_pos_1}
                  />
                  <TableRow
                    title="Race second"
                    id="race_pos_2"
                    selectedRider={prediction.race_pos_2}
                    disabled={checkExpired(currentRace.race_start_time)}
                    result={currentRace.race_pos_2}
                  />
                  <TableRow
                    title="Race third"
                    id="race_pos_3"
                    selectedRider={prediction.race_pos_3}
                    disabled={checkExpired(currentRace.race_start_time)}
                    result={currentRace.race_pos_3}
                  />
                  <TableRow
                    title="Race fastest lap"
                    id="race_fastest_lap"
                    selectedRider={prediction.race_fastest_lap}
                    disabled={checkExpired(currentRace.race_start_time)}
                    result={currentRace.race_fastest_lap}
                  />
                </tbody>
              </table>

              {!posting ? (
                <>
                  <Button variant="primary" type="submit">
                    Post Results
                  </Button>
                </>
              ) : (
                <Spinner animation="grow" variant="primary" />
              )}
            </Form>
          </Card.Body>
        </Card>

        {/* <button onClick={onClick}>Click</button> */}
        {/* <p>{races.length} total races this season</p>
        {races.map((race) => {
          return (
            <>
              <p>{race.location}</p>
              <p>{race.qualifying_start_time}</p>
              <p>{race.sprint_race_start_time}</p>
              <p>{race.race_start_time}</p>
            </>
          );
        })}
        <p>{riders.length} total riders this season</p>
        {riders.map((rider) => {
          return (
            <>
              <p>{rider.name}</p>
            </>
          );
        })} */}
      </Container>
    </>
  );
};

export default Predict;
