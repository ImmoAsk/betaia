import React from 'react';
import PropertyCard from '../../PropertyCard';



// PropertyCard must receive props from react-select
const LandlordPropertyCard = (props) => {
  const { data, innerRef, innerProps, isFocused, isSelected } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`p-2 cursor-pointer transition-colors ${
        isFocused ? 'bg-gray-100' : ''
      } ${isSelected ? 'bg-white text-white' : ''}`}
    >
      <PropertyCard
        key={data.id}
        images={data.images}
        href={"#"}
        horizontal={data.horizontal}
        title={data.title}
        category={data.category}
        location={data.location}
        price={data.price}
        badges={data.badges}
        footer={[
          ['fi-bed', data.amenities[0]],
          ['fi-bath', data.amenities[1]],
          ['fi-car', data.amenities[2]]
        ]}
      />
    </div>
  );
};

export default LandlordPropertyCard;
