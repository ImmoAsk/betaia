import { useRef, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import axios from "axios";
import { useQuery } from '@tanstack/react-query'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Pagination from 'react-bootstrap/Pagination'
import ImageLoader from '../../components/ImageLoader'
import PropertyCard from '../../components/PropertyCard'
import SimpleBar from 'simplebar-react'
import Nouislider from 'nouislider-react'
import 'simplebar/dist/simplebar.min.css'
import 'nouislider/distribute/nouislider.css'
import 'dotenv/config'
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const MapContainer = dynamic(() =>
  import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(() =>
  import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const CustomMarker = dynamic(() =>
  import('../../components/partials/CustomMarker'),
  { ssr: false }
)
const Popup = dynamic(() =>
  import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
import 'leaflet/dist/leaflet.css'
import getPropertyFullUrl from '../../utils/getPropertyFullURL'
import buildPropertyBadge from '../../utils/buildPropertyBadge'
import getFirstImageArray from '../../utils/formatFirsImageArray'
import { useSession } from 'next-auth/react'
import IAPaginaation from '../../components/iacomponents/IAPagination'
import { buildPropertiesArray } from '../../utils/generalUtils'
import FlashImmoPagination from '../../components/iacomponents/FlashImmoPagination'


function constructApiUrl(apiUrl, offre, ville, quartier, categorie,usage) {
  // Start constructing the query
  let query = `query={getPropertiesByKeyWords(limit:81,orderBy:{column:NUO,order:DESC}`;

  // Conditionally add each parameter if it is provided
  if (offre) {
    query += `,offre_id:"${offre}"`;
  }
  if (ville) {
    query += `,ville_id:"${ville}"`;
  }
  if (quartier) {
    query += `,quartier_id:"${quartier}"`;
  }
  if (usage) {
    query += `,usage:${usage}`;
  }
  if (categorie) {
    query += `,categorie_id:"${categorie}"`;
  }

  // Close the query string
  query += `){badge_propriete{badge{badge_name,badge_image}},visuels{uri},surface,lat_long,nuo,usage,offre{denomination,id},categorie_propriete{denomination,id},pays{code,id},piece,titre,garage,cout_mensuel,ville{denomination,id},wc_douche_interne,cout_vente,quartier{denomination,id}}}`;

  // Construct the full URL
  const fullUrl = `${apiUrl}?${query}`;
  
  return fullUrl;
}
const FlashImmoPage = ({ categoryParam, offerParam, usageParam,townParam, districtParam,_rentingProperties }) => {

  // Add extra class to body
  useEffect(() => {
    const body = document.querySelector('body')
    document.body.classList.add('fixed-bottom-btn')
    return () => body.classList.remove('fixed-bottom-btn')
  })

  // Query param (Switch between Rent and Sale category)
  const router = useRouter();
  console.log('Category:', categoryParam);
  console.log('Offer:', offerParam);
  console.log('Town:', townParam);
  console.log('District:', districtParam);
  console.log('Usage:', usageParam);

  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' })
  const { data: session } = useSession();
  const rentingProperties = buildPropertiesArray(_rentingProperties);
  //console.log("Catalogue 3:",_rentingProperties);
  return (
    <RealEstatePageLayout
      pageTitle={"FlashImmo : Immobilier en temps réel"}
      activeNav='flashimmo'
      userLoggedIn={session ? true : false}
    >
      {/* Page container */}
      <Container className='mt-5 pt-5 p-0'>
       
            {/* Pagination */}
            <FlashImmoPagination dataPagineted={rentingProperties} />
          
      </Container>
    </RealEstatePageLayout>
  )
}
export async function getServerSideProps(context) {
  // Fetch data from external API
  
  // Extract query parameters from the context object
  const { query } = context;
  const { categorie, offre, ville, quartier, usage} = query;
  try {
    const url = constructApiUrl(apiUrl, offre, ville, quartier, categorie,usage);
    console.log(url)
    const response = await axios.get(url);
    const _rentingProperties = await response.data;
    // Pass them as props to the component
  return {
    props: {
      categoryParam: categorie || null,
      offerParam: offre || null,
      townParam: ville || null,
      usageParam: usage || null,
      districtParam: quartier || null,
      _rentingProperties: _rentingProperties.data.getPropertiesByKeyWords || [],
    },
  };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  
  
}
export default FlashImmoPage
