import { Col, Row } from "react-bootstrap";
import PropertyCardOverlay from "../PropertyCardOverlay";

export default function PropertiesOverlayList({ properties }) {

  // Helper function to chunk the properties into groups of 3
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  // Break the properties into chunks of 3
  const propertyChunks = chunkArray(properties, 3);

  return (
    <>
      {propertyChunks.map((chunk, rowIndex) => (
        <Row key={rowIndex} className='g-4 mb-4'>
          {/* First column contains the first property (colIndex === 0) */}
          <Col key={`${rowIndex}-0`} md={6}>
            <PropertyCardOverlay
              img={{
                src: chunk[0]?.images?.[0][0] || '/images/tg/recent/01.jpg', // Fallback image if images array is empty or undefined
                alt: chunk[0]?.title || 'Property image' // Fallback alt text if the title is undefined
              }}
              href={chunk[0]?.href || '/tg/single-v1'}
              title={chunk[0]?.title || 'Property Title'}
              category={chunk[0]?.category || 'For sale'}
              location={chunk[0]?.location || 'Unknown Location'}
              overlay
              badges={chunk[0]?.badges || [['info', 'New']]}
              button={{
                href: chunk[0]?.href || '/tg/single-v1',
                title: chunk[0]?.price || 'Unknown Price',
                variant: 'primary',
                wishlistProps: {
                  onClick: () => console.log(`You've added ${chunk[0]?.title} to your wishlist!`)
                }
              }}
              className='h-100'
            />
          </Col>

          {/* Second column contains the second and third properties */}
          <Col key={`${rowIndex}-1`} md={6}>
            {/* Second property */}
            <PropertyCardOverlay
              img={{
                src: chunk[1]?.images?.[0][0] || '/images/tg/recent/02.jpg', // Fallback image
                alt: chunk[1]?.title || 'Property image'
              }}
              href={chunk[1]?.href || '/tg/single-v1'}
              title={chunk[1]?.title || 'Property Title'}
              category={chunk[1]?.category || 'For sale'}
              location={chunk[1]?.location || 'Unknown Location'}
              overlay
              badges={chunk[1]?.badges || [['info', 'New']]}
              button={{
                href: chunk[1]?.href || '/tg/single-v1',
                title: chunk[1]?.price || 'Unknown Price',
                variant: 'primary',
                wishlistProps: {
                  onClick: () => console.log(`You've added ${chunk[1]?.title} to your wishlist!`)
                }
              }}
              className='mb-4'
            />

            {/* Third property */}
            {chunk[2] && (
              <PropertyCardOverlay
                img={{
                  src: chunk[2]?.images?.[0][0] || '/images/tg/recent/03.jpg', // Fallback image
                  alt: chunk[2]?.title || 'Property image'
                }}
                href={chunk[2]?.href || '/tg/single-v1'}
                title={chunk[2]?.title || 'Property Title'}
                category={chunk[2]?.category || 'For sale'}
                location={chunk[2]?.location || 'Unknown Location'}
                overlay
                badges={chunk[2]?.badges || [['info', 'New']]}
                button={{
                  href: chunk[2]?.href || '/tg/single-v1',
                  title: chunk[2]?.price || 'Unknown Price',
                  variant: 'primary',
                  wishlistProps: {
                    onClick: () => console.log(`You've added ${chunk[2]?.title} to your wishlist!`)
                  }
                }}
              />
            )}
          </Col>
        </Row>
      ))}
    </>
  );
}
