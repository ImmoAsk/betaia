import axios from "axios";
export default function handler(req, res) {
  const townID = Number(req.query.townid);

  if (isNaN(townID) || typeof townID !== "number" || townID==0) {
    res.status(400).send("Not a town code here");
  }
  
  axios.get(`http://localhost:8000/api/v2?query={getDistrictsByTownId(ville_id:${townID}){id,denomination,code}}`).then((response) => {
    res.status(200).send(response.data.data.getDistrictsByTownId);
  });
}