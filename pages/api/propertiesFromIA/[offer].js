import axios from "axios";
export default function handler(req, res) {
  const {offer} = req.query;
  //console.log(offer);
  const totalFetch=2;
  axios.get(`https://api.immoask.com/public/graphql?query={offres(nature:"${offer}",count:${totalFetch}){paginatorInfo{total,count},data{numeroOffre,nature,offre_titre,bien{id,superficie,prix,type,categorie,descriptionBien,coordonnee{adresseCommun,ville,quartier}}}}}`).then((response) => {
    res.status(200).send(response.data.data.offres);
  });
}