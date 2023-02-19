import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import React, { useState } from "react";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();
  const callbackUrl = router.query?.callbackUrl ?? "/";
  const handleSubmit = async (e) => {
    setLoggingIn(true);
    e.preventDefault();

    const _target = e.target;
    const email = _target.email.value;
    const password = _target.password.value;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoggingIn(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <>
      <Container>
        <center>
          <h2>Welcome to PredictorGP, the MotoGP predictor game!</h2>
          <p>Please sign in!</p>
          {!!error && <Alert variant="danger">{error}</Alert>}
        </center>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              disabled={loggingIn}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              disabled={loggingIn}
            />
          </Form.Group>
          {!loggingIn ? (
            <>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </>
          ) : (
            <Spinner animation="grow" variant="primary" />
          )}
        </Form>
        <center>
          <p>
            Email <a href="mailto:samerf@gmail.com">samerf@gmail.com</a> to
            create an account.
          </p>
        </center>
      </Container>
    </>
  );
};

export default LoginPage;
