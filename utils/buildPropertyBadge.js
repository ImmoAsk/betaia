import usePropertyBadges from "../customHooks/usePropertyBadges";


const buildPropertyBadge = (badges_property) => {
  //const { status, data:badges_property, error, isFetching,isLoading,isError }  = usePropertyBadges(1);
  //let badgeArray = usePropertyBadges(1);
  let tempBadgesArray =[];
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

export default buildPropertyBadge;