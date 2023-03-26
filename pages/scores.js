import { useSession } from "next-auth/react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

const Scores = () => {
  const { data: session, status } = useSession();

  const [scores, setScores] = useState({
    user_ids: [],
    user_data: [],
    races: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const scores = await (await fetch("/api/scores")).json();
      setScores(scores);
    };
    fetchData();
  }, []);

  const getRaceData = (race_id) => {
    for (var i = 0; i < scores.races.length; i++) {
      if (race_id == scores.races[i].race_id) {
        return scores.races[i];
      }
    }
  };

  const onCellClick = (user_id, race_id) => {
    if (!getRaceData(race_id).qualification_started) {
      return;
    }

    setModalData({
      name: scores.user_data[user_id].name,
      prediction_data: scores.user_data[user_id].races[race_id],
      race_data: getRaceData(race_id),
    });
    setShowModal(true);
  };

  const TableRow = ({ title, result, prediction }) => {
    const match = result === prediction;

    return (
      <>
        <tr className="table-border-bottom">
          <td className="pe-5 small fw-light">{title}</td>
          <td className="pe-5 small fw-light">{result}</td>
          <td
            className={
              "pe-5 small fw-light " + (match ? "green" : result ? "red" : "")
            }
          >
            {prediction}
          </td>
        </tr>
      </>
    );
  };

  const ResultsTable = ({ predictionData, raceData }) => {
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
            result={raceData?.pole_position}
            prediction={predictionData?.pole_position}
          />
          <TableRow
            title="Sprint first"
            result={raceData?.sprint_race_pos_1}
            prediction={predictionData?.sprint_race_pos_1}
          />
          <TableRow
            title="Sprint second"
            result={raceData?.sprint_race_pos_2}
            prediction={predictionData?.sprint_race_pos_2}
          />
          <TableRow
            title="Sprint third"
            result={raceData?.sprint_race_pos_3}
            prediction={predictionData?.sprint_race_pos_3}
          />
          <TableRow
            title="Sprint fastest lap"
            result={raceData?.sprint_race_fastest_lap}
            prediction={predictionData?.sprint_race_fastest_lap}
          />
          <TableRow
            title="Race first"
            result={raceData?.race_pos_1}
            prediction={predictionData?.race_pos_1}
          />
          <TableRow
            title="Race first"
            result={raceData?.race_pos_2}
            prediction={predictionData?.race_pos_2}
          />
          <TableRow
            title="Race first"
            result={raceData?.race_pos_3}
            prediction={predictionData?.race_pos_3}
          />
          <TableRow
            title="Race fastest lap"
            result={raceData?.race_fastest_lap}
            prediction={predictionData?.race_fastest_lap}
          />
        </tbody>
      </table>
    );
  };

  const ScoresModal = () => {
    return (
      <>
        <Modal
          size="md"
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {modalData.name} -{" "}
              {modalData.race_data ? modalData.race_data.location : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ResultsTable
              predictionData={modalData.prediction_data}
              raceData={modalData.race_data}
            />
            <br></br>
            {modalData.prediction_data.score} points
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const ShowPredictions = ({ race, predictionData }) => {
    if (predictionData == null || race == null) {
      return <></>;
    }

    if (!race.qualification_started || race.race_completed) {
      return <></>;
    }

    return (
      <>
        {race.qualification_started ? (
          <>
            <p />
            <span className="pe-5 small fw-light">
              {predictionData.pole_position}
            </span>
            <br />
          </>
        ) : (
          <></>
        )}
        {race.sprint_race_started ? (
          <>
            <span className="pe-5 small fw-light">
              {predictionData.sprint_race_pos_1}
            </span>
            <br />
            <span className="pe-5 small fw-light">
              {predictionData.sprint_race_pos_2}
            </span>
            <br />
            <span className="pe-5 small fw-light">
              {predictionData.sprint_race_pos_3}
            </span>
            <br />
            <span className="pe-5 small fw-light">
              {predictionData.sprint_race_fastest_lap}
            </span>
            <br />
          </>
        ) : (
          <></>
        )}
        {race.race_started ? (
          <>
            <span className="pe-5 small fw-light">
              {predictionData.race_pos_1}
            </span>
            <br />
            <span className="pe-5 small fw-light">
              {predictionData.race_pos_2}
            </span>
            <br />
            <span className="pe-5 small fw-light">
              {predictionData.race_pos_3}
            </span>
            <br />
            <span className="pe-5 small fw-light">
              {predictionData.race_fastest_lap}
            </span>
            <br />
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  const ShowHeadings = ({ race }) => {
    if (race == null) {
      return <></>;
    }

    if (!race.qualification_started || race.race_completed) {
      return <></>;
    }

    return (
      <>
        {race.qualification_started ? (
          <>
            <p />
            <span className="pe-5 small fw-light">Pole</span>
            <br />
          </>
        ) : (
          <></>
        )}
        {race.sprint_race_started ? (
          <>
            <span className="pe-5 small fw-light">Sprint 1</span>
            <br />
            <span className="pe-5 small fw-light">Sprint 2</span>
            <br />
            <span className="pe-5 small fw-light">Sprint 3</span>
            <br />
            <span className="pe-5 small fw-light">Sprint Fastest Lap</span>
            <br />
          </>
        ) : (
          <></>
        )}
        {race.race_started ? (
          <>
            <span className="pe-5 small fw-light">Race 1</span>
            <br />
            <span className="pe-5 small fw-light">Race 2</span>
            <br />
            <span className="pe-5 small fw-light">Race 3</span>
            <br />
            <span className="pe-5 small fw-light">Race Fastest Lap</span>
            <br />
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <>
      <Container>
        <p className="small fw-light text-center my-3">
          Click on a cell in the table to see predictions and results
        </p>

        <Table bordered size="sm" striped responsive className="mb-5">
          <thead>
            <tr>
              <th></th>
              {scores.user_ids.map((user_id, index) => {
                return <th key={index}>{scores.user_data[user_id].name}</th>;
              })}
            </tr>
            <tr>
              <th>Total</th>
              {scores.user_ids.map((user_id, index) => {
                return <th key={index}>{scores.user_data[user_id].total}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {scores.races.map((race, index) => {
              return (
                <tr key={index}>
                  <td className="scores-table-cell">
                    {race.location}
                    <ShowHeadings race={race} />
                  </td>
                  {scores.user_ids.map((user_id, index) => {
                    return (
                      <td
                        key={index}
                        onClick={() => onCellClick(user_id, race.race_id)}
                        className="scores-table-cell clickable"
                      >
                        {scores.user_data[user_id].races[race.race_id]
                          ? scores.user_data[user_id].races[race.race_id].score
                          : "0"}
                        <ShowPredictions
                          race={race}
                          predictionData={
                            scores.user_data[user_id].races[race.race_id]
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
      <ScoresModal />
    </>
  );
};

export default Scores;
