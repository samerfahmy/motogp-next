import { useSession } from "next-auth/react";
import Container from "react-bootstrap/Container";

const Scores = () => {
  const { data: session, status } = useSession();

  console.log(session);
  console.log(status);

  return (
    <>
      <Container>
        <h1>Scores!</h1>
        <p>We'll put the scores here</p>
      </Container>
    </>
  );
};

export default Scores;
