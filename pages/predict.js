import Container from "react-bootstrap/Container";
import { useSession } from "next-auth/react";
import { useState } from "react";

const Predict = () => {
  const { data: session } = useSession();

  const [races, setRaces] = useState([]);
  const [riders, setRiders] = useState([]);

  // useEffect(() => {
  //   setLoading(true)
  //   fetch('/api/profile-data')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data)
  //       setLoading(false)
  //     })
  // }, [])

  const onClick = async () => {
    setRaces([]);
    const races = await (await fetch("/api/races")).json();
    setRaces(races);
    console.log(races);

    setRiders([]);
    const riders = await (await fetch("/api/riders")).json();
    setRiders(riders);

    await fetch("/api/predictions?user=1234&race=4567");
    await fetch("/api/users");
    await fetch("/api/users/1234");
  };

  return (
    <>
      <Container>
        <h1>Welcome {session?.user.name}</h1>
        <p>Enter your predictions for the upcoming race below</p>
        <p>We'll put the predictions here</p>
        <button onClick={onClick}>Click</button>
        <p>{races.length} total races this season</p>
        {races.map((race) => {
          return (
            <>
              <p>{race.location}</p>
              <p>{race.qualifying_start_time}</p>
              <p>{race.sprint_race_start_time}</p>
              <p>{race.race_start_time}</p>
            </>
          );
        })}
        <p>{riders.length} total riders this season</p>
        {riders.map((rider) => {
          return (
            <>
              <p>{rider.name}</p>
            </>
          );
        })}
      </Container>
    </>
  );
};

export default Predict;
