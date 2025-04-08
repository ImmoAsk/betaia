import { useState } from 'react'
import {useSession } from 'next-auth/react'
import PublicBoardSideBar from '../../../components/iacomponents/RealEstateAgency/PublicBoardSideBar'
import RealEstateAgencyPublicBoard from '../../../components/iacomponents/RealEstateAgency/RealEstateAgencyPublicBoard'
import { Container } from 'react-bootstrap'

const Organisation = ({ accountPageTitle,organisationName,organisationCode, children }) => {

  // State to control Collapse
  const [open, setOpen] = useState(false)
  const { data: session } = useSession();
  //console.log(session);
  const roleId = Number(session && session.user?.roleId);
  //console.log(roleId);
    //const accountPageTitle = 'Mon organisation';
  return (
    <RealEstateAgencyPublicBoard accountPageTitle="Mon organisation">
      <Container fluid className='pt-5 pb-lg-4 mt-5 mb-sm-2'>
        Welcome to your organisation
      </Container >
    </RealEstateAgencyPublicBoard>
  )
}


export default Organisation