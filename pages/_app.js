// import '@/styles/globals.css'
//import "bootstrap/dist/css/bootstrap.min.css";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useRouter } from "next/router";
import { SessionProvider, useSession, signOut } from "next-auth/react";

const AdminAuth = ({ children }) => {
  const { data: session, status } = useSession();

  if (status == "authenticated" && session.user.isAdmin) {
    return children;
  }

  return;
};

const MenuItem = ({ title, path }) => {
  const router = useRouter();

  return (
    <Link href={path} passHref legacyBehavior>
      <Nav.Link active={router.pathname === path}>{title}</Nav.Link>
    </Link>
  );
};

const Header = () => {
  const router = useRouter();

  const logout = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/login" });

    router.push(data.url);
  };

  return (
    <>
      <Navbar collapseOnSelect bg="primary" variant="dark" expand="lg">
        <Container fluid="md">
          <Image
            src="/app_icon.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
          <Link href="/predict" passHref legacyBehavior>
            <Navbar.Brand>PredictorGP</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" defaultActiveKey="/">
              <MenuItem title="Predict" path="/predict" />
              <MenuItem title="Scores" path="/scores" />
              <MenuItem title="Calendar" path="/calendar" />
              <AdminAuth>
                <MenuItem title="Admin" path="/admin" />
              </AdminAuth>
              <Nav.Link
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <Head>
        <title>PredictorGP</title>
        <meta name="description" content="MotoGP Prediction Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0d6efd" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />

        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        ></link>
      </Head>

      {router.pathname != "/login" ? <Header /> : <></>}

      <Component {...pageProps} />
    </SessionProvider>
  );
}
