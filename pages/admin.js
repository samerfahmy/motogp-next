import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import React, { useState, useEffect } from "react";

export default function Admin() {
  const [posting, setPosting] = useState(false);
  const [races, setRaces] = useState([]);
  const [riders, setRiders] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

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
    setShowErrorToast(false);
    setShowSuccessToast(false);
    event.preventDefault();

    const target = event.target;

    let raceResult = {
      race_id: id,
      pole_position: target.pole_position.value,
      sprint_race_pos_1: target.sprint_race_pos_1.value,
      sprint_race_pos_2: target.sprint_race_pos_2.value,
      sprint_race_pos_3: target.sprint_race_pos_3.value,
      sprint_race_fastest_lap: target.sprint_race_fastest_lap.value,
      race_pos_1: target.race_pos_1.value,
      race_pos_2: target.race_pos_2.value,
      race_pos_3: target.race_pos_3.value,
      race_fastest_lap: target.race_fastest_lap.value,
    };

    for (var i = 0; i < races.length; i++) {
      if (races[i].id == raceResult.race_id) {
        raceResult.location = races[i].location;
        races[i] = raceResult;
        setRaces(races);
        break;
      }
    }

    const data = JSON.stringify(raceResult);

    const response = await fetch("/api/races/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (response.status != 200) {
      setShowErrorToast(true);
    } else {
      setShowSuccessToast(true);
    }

    setPosting(false);
  };

  const SuccessToast = () => {
    return (
      <ToastContainer position="bottom-center" className="py-5 text-center">
        <Toast
          show={showSuccessToast}
          delay={3000}
          bg="success"
          onClose={() => setShowSuccessToast(false)}
          autohide
        >
          <Toast.Header closeButton={false}>Success!</Toast.Header>
          <Toast.Body className="text-white">
            Results have been posted.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    );
  };

  const ErrorToast = () => {
    return (
      <ToastContainer position="bottom-center" className="py-5 text-center">
        <Toast
          show={showErrorToast}
          delay={3000}
          bg="danger"
          onClose={() => setShowErrorToast(false)}
          autohide
        >
          <Toast.Header closeButton={false}>Error</Toast.Header>
          <Toast.Body className="text-white">
            Please try to post your results again.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    );
  };

  const RiderSelection = ({ id, selectedRider }) => {
    return (
      <Form.Select id={id} defaultValue={selectedRider}>
        <option key="empty" value=""></option>
        {riders.map((rider, index) => {
          return (
            <option key={index} value={rider.name}>
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
        <Accordion className="my-3">
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

                <div className="my-3">
                  {!posting ? (
                    <>
                      <Button variant="primary" type="submit">
                        Post Results
                      </Button>
                    </>
                  ) : (
                    <Spinner animation="grow" variant="primary" />
                  )}
                </div>
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
        <div className="text-center my-3">
          Set the results of the races below
        </div>
        {races.map((race, index) => {
          return <RaceItem key={index} race={race} />;
        })}
      </Container>
      <ErrorToast />
      <SuccessToast />
    </>
  );
}
