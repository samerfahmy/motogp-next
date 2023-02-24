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
  const handleSubmit = async (event) => {
    setLoggingIn(true);
    event.preventDefault();

    const target = event.target;
    const email = target.email.value.toLowerCase();
    const password = target.password.value.toLowerCase();
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
        <div className="text-center pt-4 mb-4">
          <div className="mb-4">
            <img src="app_icon.png" height={60} />
          </div>
          <h5>Welcome to PredictorGP, the MotoGP predictor game!</h5>
          <p>Please sign in!</p>
          {!!error && <Alert variant="danger">{error}</Alert>}
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
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
          <div className="text-center my-5">
            {!loggingIn ? (
              <>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </>
            ) : (
              <Spinner animation="grow" variant="primary" />
            )}
          </div>
        </Form>
        <div className="text-center medium-text">
          <p>
            Email <a href="mailto:samerf@gmail.com">samerf@gmail.com</a> to
            create an account.
          </p>
        </div>
      </Container>
    </>
  );
};

export default LoginPage;
