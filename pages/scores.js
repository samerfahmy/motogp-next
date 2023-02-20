import { useSession } from "next-auth/react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";

const Scores = () => {
  const { data: session, status } = useSession();

  // console.log(session);
  // console.log(status);

  const [scores, setScores] = useState({
    user_ids: [],
    user_data: [],
    races: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const scores = await (await fetch("/api/scores")).json();
      setScores(scores);
    };
    fetchData();
  }, []);

  return (
    <>
      <Container>
        <h1>Scores!</h1>
        <p>We will put the scores here</p>

        <Table bordered size="sm" striped>
          <thead>
            <tr>
              <th></th>
              {scores.user_ids.map((user_id) => {
                return <th key="">{scores.user_data[user_id].name}</th>;
              })}
            </tr>
            <tr>
              <th>Total</th>
              {scores.user_ids.map((user_id) => {
                return <th key="">{scores.user_data[user_id].total}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {scores.races.map((race) => {
              return (
                <tr key="">
                  <td>{race.location}</td>
                  {scores.user_ids.map((user_id) => {
                    return (
                      <td key="">
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
    </>
  );
};

export default Scores;
