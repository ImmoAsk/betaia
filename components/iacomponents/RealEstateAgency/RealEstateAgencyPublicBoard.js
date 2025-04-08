import { useState } from 'react'

import { getSession, useSession } from 'next-auth/react'
import RealEstatePageLayout from '../../partials/RealEstatePageLayout'
import PublicBoardSideBar from './PublicBoardSideBar'

const RealEstateAgencyPublicBoard = ({ accountPageTitle, children }) => {

  // State to control Collapse
  const [open, setOpen] = useState(false)

  const locataire = [
    {
      id: 1,
      accessStatut: 1,
      ressourceName: 'Paiement de loyers',
      resourcelink: '/tg/account-help',
      icon: 'fi-help'
    },
    {
      id: 2,
      accessStatut: 1,
      ressourceName: 'Tableau immobilier',
      resourcelink: '/tg/account-properties',
      icon: 'fi-home'
    },
    {
      id: 3,
      accessStatut: 1,
      ressourceName: 'Notifications',
      resourcelink: '/tg/account-notifications',
      icon: 'fi-bell'
    },
    {
      id: 4,
      accessStatut: 1,
      ressourceName: 'Biens immobiliers à visiter',
      resourcelink: '/tg/account-wishlist',
      icon: 'fi-heart'
    },
    {
      id: 5,
      accessStatut: 1,
      ressourceName: 'Mon logement actuel',
      resourcelink: '/tg/account-location',
      icon: 'fi-home'
    },
    {
      id: 6,
      accessStatut: 1,
      ressourceName: 'Assurance immobilière',
      resourcelink: '/tg/account-insurance',
      icon: 'fi-home'
    }
  ];
  const { data: session } = useSession();
  //console.log(session);
  const roleId = Number(session && session.user?.roleId);
  //console.log(roleId);

  return (
    <RealEstatePageLayout 
      pageTitle={accountPageTitle}>
        <PublicBoardSideBar accountPageTitle={accountPageTitle}>
          {children}
        </PublicBoardSideBar>
    </RealEstatePageLayout>
  )
}


export default RealEstateAgencyPublicBoard
