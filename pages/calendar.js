import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import moment from "moment";

const Calendar = () => {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setRaces([]);
      const races = await (await fetch("/api/races")).json();
      setRaces(races);
    };
    fetchData();
  }, []);

  return (
    <>
      <Container>
        <h1>Calendar</h1>
        {races.map((race) => {
          return (
            <>
              <Card>
                <Card.Body>
                  <Card.Title>{race.location}</Card.Title>
                  <Card.Text>
                    <span class="fw-light">
                      <small>
                        Qualifying on{" "}
                        {moment(race.qualifying_start_time).format(
                          "dddd, MMMM Do, h:mm a"
                        )}
                      </small>
                    </span>
                    <br></br>
                    <span>
                      Sprint race on{" "}
                      {moment(race.sprint_race_start_time).format(
                        "dddd, MMMM Do, h:mm a"
                      )}
                    </span>
                    <br></br>
                    <span>
                      Race on{" "}
                      {moment(race.race_start_time).format(
                        "dddd, MMMM Do, h:mm a"
                      )}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </>
          );
        })}
      </Container>
    </>
  );
};

export default Calendar;
