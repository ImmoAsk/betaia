  /* // Gallery state
  const [gallery, setGallery] = useState([]);
  const [quartersList, setQuartersList] = useState([]);
  const [isFurnished, setIsFurnished] = useState(0);
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyOwner, setPropertyOwner] = useState(session ? session.user.id : 0);
  const [propertyType, setPropertyType] = useState(0);
  const [propertyHouseHold, setPropertyHouseHold] = useState('0');

  //1 is realestate agent, 2 is realestate owner
  const [propertyUserRole, setpropertyUserRole] = useState(1);
  const [propertyOffer, setPropertyOffer] = useState(0);
  const [propertySecurity, setPropertySecurity] = useState(0);
  const [propertyCountry, setPropertyCountry] = useState(228);
  const [propertyTown, setPropertyTown] = useState('1');
  const [propertyQuarter, setPropertyQuarter] = useState(0);
  const [propertyAdress, setPropertyAdress] = useState("");
  const [propertyFloor, setPropertyFloor] = useState(0);
  const [propertyWater, setPropertyWater] = useState(0);
  const [propertyElectricity, setPropertyElectricity] = useState(0);
  const [propertyPool, setPropertyPool] = useState(0);
  const [propertyLivingRooms, setPropertyLivingRooms] = useState(0);
  const [propertyBedRooms, setPropertyBedRooms] = useState(0);
  const [propertyCautionGuarantee, setCautionGuarantee] = useState(0);
  const [propertyTerraces, setPropertyTerraces] = useState('0');
  const [propertyBalcony, setPropertyBalcony] = useState('0');
  const [propertyVisitRight, setVisitRight] = useState(0);
  const [propertyHonorary, setPropertyHonorary] = useState(0);
  const [propertyMonthPrice, setPropertyMonthPrice] = useState(0);
  const [propertyDayPrice, setPropertyDayPrice] = useState(0);
  const [propertyInvestmentPrice, setPropertyInvestmentPrice] = useState(0);
  const [propertyKitchen, setPropertyKitchen] = useState(0);
  const [propertyBuyPrice, setPropertyBuyPrice] = useState(0);
  const [propertyDescription, setPropertyDescription] = useState(" ");
  const [propertyArea, setPropertyArea] = useState(10);
  const [propertyGarden, setPropertyGarden] = useState(0);
  const [imagesProperty, setImagesProperty] = useState([]);
  //const { data: session } = useSession();

  const validationSchema = Yup.object().shape({
    propertyTown: Yup.string()
      .required('Preciser la ville svp'),
    propertyOffer: Yup.string()
      .required('Preciser l\'offre immobilière svp'),
    propertyAdress: Yup.string()
      .required('Indiquer une adresse commune de référence'),
    propertyType: Yup.string()
      .required('Selectionner le type du bien immobilier'),
    propertyQuarter: Yup.string()
      .required('Selectionner le quartier')

  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const { data: session, status } = useSession();

  const buildAppendMapFileUpload = (event) => {
    event.stopPropagation();
    event.preventDefault();

    var _formData = `
    {
      "descriptif": "${propertyDescription}",
      "piece": ${Number(propertyBedRooms)},
      "salon": ${Number(propertyLivingRooms)},
      "titre": "${propertyTitle}",
      "pays_id": ${propertyCountry},
      "papier_propriete":"TF",
      "duree_minimale":"180",
      "surface":${Number(propertyArea)},
      "cout_mensuel":${Number(propertyMonthPrice)},
      "cout_vente":${Number(propertyBuyPrice)},
      "part_min_investissement":${Number(propertyInvestmentPrice)},
      "usage":1,
      "garage":${Number(parkingsValue)},
      "nuo":4040,
      "eau":${Number(propertyWater)},
      "electricite":${Number(propertyElectricity)},
      "categorie_id":${Number(propertyType)},
      "user_id":${Number(session ? session.user.id : 0)},
      "offre_id":${Number(propertyOffer)},
      "ville_id":${Number(propertyTown)},
      "quartier_id":${Number(propertyQuarter)},
      "adresse_id":"${propertyAdress}",
      "lat_long":"6.12564358,1.1568922",
      "piscine":${Number(propertyPool)},
      "gardien_securite":${Number(propertySecurity)},
      "salon":${Number(propertyLivingRooms)},
      "cuisine":${Number(propertyKitchen)},
      "jardin":${Number(propertyGarden)},
      "menage":${Number(propertyHouseHold)},
      "etage":${Number(propertyFloor)},
      "caution_avance":${Number(propertyCautionGuarantee)},
      "honoraire":${Number(propertyHonorary)},
      "balcon":${Number(propertyBalcony)},
      "terrasse_balcon":${Number(propertyTerraces)},
      "cout_visite":${Number(propertyVisitRight)},
      "wc_douche_interne":${Number(InsideBathRoomsValue)},
      "wc_douche_externe":${Number(OutsideBathRoomsValue)},
      "url":null
  }`
    const appendMap = '';
    formData.append('operations', `{"query":"mutation AddPropertyImage($data:ProprieteInput!){enrollProperty(input:$data)}","variables":{"data":${_formData}}}`);
    for (let i = 0; i < imagesProperty.length; i++) {
      formData.append(`${i}`, imagesProperty[i].file);
      appendMap += `"${i}":[`.concat(`"variables.data.url.${i}"]`);
      if (i == imagesProperty.length - 1) { appendMap += "" } else { appendMap += "," }
    }
    formData.append('map', `{${appendMap}}`);

    //console.log(JSON.stringify(formData));

    var config = {
      method: 'post',
      url: 'https://immoaskbetaapi.omnisoft.africa/public/api/v2',
      data: formData
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(JSON.parse(response.data)));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const onSubmit = (data, event) => {
    alert(JSON.stringify(data));
    buildAppendMapFileUpload(event);
  } */


  // Gallery state