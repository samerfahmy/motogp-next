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

  const onCellClick = (user_id, race_id) => {
    setModalData(scores.user_data[user_id].races[race_id]);
    setShowModal(true);
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
            <Modal.Title>Name - Location</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Prediction data
          </Modal.Body>
        </Modal>
      </>
    );
  };

  return (
    <>
      <Container>
        <p className="small fw-light text-center my-3">
          Click on a cell in the table to see predictions and results
        </p>

        <Table bordered size="sm" striped>
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
                  <td>{race.location}</td>
                  {scores.user_ids.map((user_id, index) => {
                    return (
                      <td
                        key={index}
                        onClick={() => onCellClick(user_id, race.race_id)}
                      >
                        {scores.user_data[user_id].races[race.race_id]
                          ? scores.user_data[user_id].races[race.race_id].score
                          : "0"}
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
