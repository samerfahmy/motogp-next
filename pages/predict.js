import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Modal from "react-bootstrap/Modal";
import moment from "moment";

const Predict = () => {
  const [posting, setPosting] = useState(false);
  const [currentRace, setCurrentRace] = useState({});
  const [riders, setRiders] = useState([]);
  const [prediction, setPrediction] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);

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

  const postPrediction = async (event, id) => {
    setPosting(true);
    setShowSuccessToast(false);
    setShowErrorToast(false);
    event.preventDefault();

    const target = event.target;

    let postedPrediction = {
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

    setPrediction(postedPrediction);

    const data = JSON.stringify(postedPrediction);

    const response = await fetch("/api/predictions", {
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

  const format = (date) => {
    return moment(date).format("dddd, MMMM Do, h:mm a");
  };

  const PointsModal = () => {
    return (
      <>
        <Modal
          size="md"
          show={showPointsModal}
          onHide={() => setShowPointsModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Points System</Modal.Title>
          </Modal.Header>
          <Modal.Body className="small-text">
            + 1 point for predicting the correct pole position
            <br />
            + 1 point for predicting a rider who is on the podium in Sprint
            <br />
            + 1 point for predicting a rider in their correct position in Sprint
            <br />
            + 2 point for predicting a rider who is on the podium in Race
            <br />
            + 2 point for predicting a rider in their correct position in Race
            <br />
            + 1 point for predicting the rider with the fastest lap
            <br />
          </Modal.Body>
        </Modal>
      </>
    );
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
            Your predictions have been posted. Good luck!
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
            Please try to post your predictions again.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    );
  };

  const RiderSelection = ({ id, selectedRider, disabled = false }) => {
    return (
      <Form.Select id={id} defaultValue={selectedRider} disabled={disabled}>
        <option key="empty" value=""></option>
        {riders.map((rider, index) => {
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
    const match = selectedRider === result;

    return (
      <tr>
        <td className="prediction-table-row-title medium-text">{title}</td>
        <td className="prediction-table-row-selection">
          <RiderSelection
            id={id}
            selectedRider={selectedRider}
            disabled={disabled}
          />
        </td>
        <td
          className={
            "prediction-table-row-result medium-text " +
            (match ? "green" : "red")
          }
        >
          {result}
        </td>
      </tr>
    );
  };

  return (
    <>
      <Container>
        <Row className="text-center my-3">
          <h4>Welcome {session?.user.name}</h4>
          <p className="small fw-light">
            Enter your predictions for the upcoming race below
          </p>
        </Row>

        <Form onSubmit={(event) => postPrediction(event, 1)}>
          <Card>
            <Card.Body>
              <Card.Title>{currentRace.location}</Card.Title>
              <Row className="small-text">
                <span>
                  Predict Pole by {format(currentRace.qualifying_start_time)}
                </span>
              </Row>
              <Row className="small-text">
                <span>
                  Predict Sprint Race by{" "}
                  {format(currentRace.sprint_race_start_time)}
                </span>
              </Row>
              <Row className="small-text">
                <span>
                  Predict Race by {format(currentRace.race_start_time)}
                </span>
              </Row>

              <table className="my-3">
                <tbody>
                  <TableRow
                    title="Pole"
                    id="pole_position"
                    selectedRider={prediction?.pole_position}
                    disabled={checkExpired(currentRace?.qualifying_start_time)}
                    result={currentRace?.pole_position}
                  />
                </tbody>
              </table>
              <fieldset className="prediction-section">
                <legend className="legend fw-light">Sprint Race</legend>
                <table className="prediction-table">
                  <tbody>
                    <TableRow
                      title="First"
                      id="sprint_race_pos_1"
                      selectedRider={prediction?.sprint_race_pos_1}
                      disabled={checkExpired(
                        currentRace?.sprint_race_start_time
                      )}
                      result={currentRace?.sprint_race_pos_1}
                    />
                    <TableRow
                      title="Second"
                      id="sprint_race_pos_2"
                      selectedRider={prediction?.sprint_race_pos_2}
                      disabled={checkExpired(
                        currentRace?.sprint_race_start_time
                      )}
                      result={currentRace?.sprint_race_pos_2}
                    />
                    <TableRow
                      title="Third"
                      id="sprint_race_pos_3"
                      selectedRider={prediction?.sprint_race_pos_3}
                      disabled={checkExpired(
                        currentRace?.sprint_race_start_time
                      )}
                      result={currentRace?.sprint_race_pos_3}
                    />
                    <TableRow
                      title="Fastest lap"
                      id="sprint_race_fastest_lap"
                      selectedRider={prediction?.sprint_race_fastest_lap}
                      disabled={checkExpired(
                        currentRace?.sprint_race_start_time
                      )}
                      result={currentRace?.sprint_race_fastest_lap}
                    />
                  </tbody>
                </table>
              </fieldset>
              <fieldset className="prediction-section">
                <legend className="legend fw-light">Race</legend>
                <table className="prediction-table">
                  <tbody>
                    <TableRow
                      title="First"
                      id="race_pos_1"
                      selectedRider={prediction?.race_pos_1}
                      disabled={checkExpired(currentRace?.race_start_time)}
                      result={currentRace?.race_pos_1}
                    />
                    <TableRow
                      title="Second"
                      id="race_pos_2"
                      selectedRider={prediction?.race_pos_2}
                      disabled={checkExpired(currentRace?.race_start_time)}
                      result={currentRace?.race_pos_2}
                    />
                    <TableRow
                      title="Third"
                      id="race_pos_3"
                      selectedRider={prediction?.race_pos_3}
                      disabled={checkExpired(currentRace?.race_start_time)}
                      result={currentRace?.race_pos_3}
                    />
                    <TableRow
                      title="Fastest lap"
                      id="race_fastest_lap"
                      selectedRider={prediction?.race_fastest_lap}
                      disabled={checkExpired(currentRace?.race_start_time)}
                      result={currentRace?.race_fastest_lap}
                    />
                  </tbody>
                </table>
              </fieldset>
              <span className="fw-light" style={{ "font-size": 12 }}>
                <em>
                  *Note: You can predict as many times as you like until the cut
                  off time listed above
                </em>
              </span>
            </Card.Body>
          </Card>
          <div className="mt-3 text-center mb-3">
            {!posting ? (
              <>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    posting || checkExpired(currentRace?.race_start_time)
                  }
                >
                  Post Predictions
                </Button>
              </>
            ) : (
              <Spinner animation="grow" variant="primary" />
            )}
          </div>
        </Form>

        <ErrorToast />
        <SuccessToast />

        <div className="text-center small-text mb-5">
          <span
            className="info-link"
            onClick={() => {
              setShowPointsModal(true);
            }}
          >
            point system info
          </span>
          <PointsModal />
        </div>
      </Container>
    </>
  );
};

export default Predict;
