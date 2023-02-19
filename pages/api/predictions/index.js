// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  console.log("/predictions");

  const query = req.query;
  const { user, race } = query;

  console.log(JSON.stringify(query));
  console.log("user: " + user);
  console.log("race: " + race);

  res.status(200).json("success");
}
