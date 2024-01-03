import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useFromIAAPI2DevAPI() {
    return useQuery(["OldListing"],
  ()=> axios.get(`https://api.immoask.com/public/graphql?query={offres(nature:"louer",count:2){paginatorInfo{total,count}data{numeroOffre,nature,offre_titre,bien{id,superficie,prix,type,categorie,descriptionBien,coordonnee{adresseCommun,ville,quartier}}}}}`).then(res=>res.data.data.offres));
}