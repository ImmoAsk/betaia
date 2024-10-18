import usePropertyBadges from "../customHooks/usePropertyBadges";


const createTopPropertiesInsight = (badges_property) => {

  let tempBadgesArray =[
  [
    {
      href: '/tg/single-v2',
      img: '/images/tg/top-properties/01.jpg',
      category: '121 disponibles',
      title: 'Min. 55 000 XOF/mois',
      location: 'Agoè, Lomé, Togo'
    },
    {
      href: '/tg/single-v2',
      img: ['/images/tg/top-properties/02.jpg', 735, 389],
      category: '121 disponibles',
      title: 'Min. 45 000 XOF/mois',
      location: 'Adidogomé, Lomé, Togo'
    },
    {
      href: '/tg/single-v2',
      img: ['/images/tg/top-properties/03.jpg', 735, 523],
      category: '80 dispo',
      title: 'Min. 55 000 XOF/mois',
      location: 'Bè, Lomé, Togo'
    }
  ],
  [
    {
      href: '/tg/single-v2',
      img: '/images/tg/top-properties/04.jpg',
      category: '45 disponibles',
      title: 'Min. 50 000 XOF/mois',
      location: 'Décon, Lomé, Togo'
    },
    {
      href: '/tg/single-v2',
      img: ['/images/tg/top-properties/05.jpg', 735, 523],
      category: 'For sale',
      title: 'Country House',
      location: '6954 Grand AveMaspeth, NY 11378'
    },
    {
      href: '/tg/single-v2',
      img: ['/images/tg/top-properties/06.jpg', 735, 389],
      category: 'For rent',
      title: 'Modern House | 90 sq.m',
      location: '21 Pulaski Road Kings Park, NY 11754'
    }
  ],
  [
    {
      href: '/tg/single-v2',
      img: '/images/tg/top-properties/07.jpg',
      category: 'For rent',
      title: 'Luxury Rental Villa',
      location: '6954 Grand AveMaspeth, NY 11378'
    },
    {
      href: '/tg/single-v2',
      img: ['/images/tg/top-properties/08.jpg', 735, 389],
      category: 'For sale',
      title: 'Condominium',
      location: '21 Pulaski Road Kings Park, NY 11754'
    },
    {
      href: '/tg/single-v2',
      img: ['/images/tg/top-properties/09.jpg', 735, 523],
      category: 'For rent',
      title: 'Family Home',
      location: '118-11 Sutphin Blvd Jamaica, NY 11434'
    }
  ]
];
  //console.log(badges_property);
  if(Array.isArray(badges_property) && !badges_property.length){
    tempBadgesArray=[];
  }
  badges_property.map((badge) => {
    tempBadgesArray.push([badge.badge.badge_image,badge.badge.badge_name]);
  });
  //console.log(tempBadgesArray);
  let property_badges = tempBadgesArray;
  return property_badges;
}

export default createTopPropertiesInsight;