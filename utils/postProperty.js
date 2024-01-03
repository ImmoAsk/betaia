import axios from "axios";
const postProperty = (property) => {

    var data = JSON.stringify({
      query: `mutation {
      enrollProperty(
        input: {
          descriptif: "${property}"
          piece: ${Number(propertyBedRooms)}
          titre: "${propertyTitle}"
          pays_id: 228
          papier_propriete:"Titre foncier"
          duree_minimale:"180"
          surface:${Number(propertyArea)}
          cout_mensuel:${Number(propertyMonthPrice)}
          usage:1
          nuo:
          categorie_id:${Number(propertyType)}
          user_id:
          offre_id:${Number(propertyOffer)}
          ville_id:${Number(propertyTown)}
          quartier_id:${Number(propertyQuarter)}
          adresse_id:"${propertyAdress}"
          lat_long:"6.12564358,1.1568922"
          salon:${Number(propertyLivingRooms)}
          cuisine:2
          jardin:0
          menage:0
          honoraire:${Number(propertyHonorary)}
          terrasse_balcon:0
          cout_visite:${Number(propertyVisitRight)}
        }
      ) {
        id
        descriptif
        salon
        nuo
      }
    }`,
      variables: {}
    });
    
    var config = {
      method: 'post',
      url: 'http://127.0.0.1:8000/api/v2',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log("Property saved");
    })
    .catch(function (error) {
      console.log(error);
    });
};  
export default postProperty;