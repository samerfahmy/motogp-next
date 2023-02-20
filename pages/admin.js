import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
import React, { useState, useEffect } from "react";

export default function Admin() {
  const [posting, setPosting] = useState(false);
  const [races, setRaces] = useState([]);
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setRaces([]);
      const races = await (await fetch("/api/races")).json();
      setRaces(races);

      setRiders([]);
      const riders = await (await fetch("/api/riders")).json();
      setRiders(riders);
    };
    fetchData();
  }, []);

  const postResults = async (event, id) => {
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

    console.log(data);

    fetch("/api/races/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    setPosting(false);
  };

  const RiderSelection = ({ id, selectedRider }) => {
    return (
      <Form.Select id={id} defaultValue={selectedRider}>
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

  const TableRow = ({ title, id, selectedRider }) => {
    return (
      <tr>
        <td>{title}</td>
        <td></td>
        <td>
          <RiderSelection id={id} selectedRider={selectedRider} />
        </td>
      </tr>
    );
  };

  const RaceItem = ({ race }) => {
    return (
      <>
        <Accordion>
          <Accordion.Item eventKey="1">
            <Accordion.Header>{race.location}</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={(event) => postResults(event, race.id)}>
                <table>
                  <tbody>
                    <TableRow
                      title="Pole"
                      id="pole_position"
                      selectedRider={race.pole_position}
                    />
                    <TableRow
                      title="Sprint first"
                      id="sprint_race_pos_1"
                      selectedRider={race.sprint_race_pos_1}
                    />
                    <TableRow
                      title="Sprint second"
                      id="sprint_race_pos_2"
                      selectedRider={race.sprint_race_pos_2}
                    />
                    <TableRow
                      title="Sprint third"
                      id="sprint_race_pos_3"
                      selectedRider={race.sprint_race_pos_3}
                    />
                    <TableRow
                      title="Sprint fastest lap"
                      id="sprint_race_fastest_lap"
                      selectedRider={race.sprint_race_fastest_lap}
                    />
                    <TableRow
                      title="Race first"
                      id="race_pos_1"
                      selectedRider={race.race_pos_1}
                    />
                    <TableRow
                      title="Race second"
                      id="race_pos_2"
                      selectedRider={race.race_pos_2}
                    />
                    <TableRow
                      title="Race third"
                      id="race_pos_3"
                      selectedRider={race.race_pos_3}
                    />
                    <TableRow
                      title="Race fastest lap"
                      id="race_fastest_lap"
                      selectedRider={race.race_fastest_lap}
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
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </>
    );
  };

  return (
    <>
      <Container>
        <center>
          <p>Set the results of the races below</p>
        </center>
      </Container>
      <Container>
        {races.map((race) => {
          return <RaceItem key={race.id} race={race} />;
        })}
      </Container>
    </>
  );
}
