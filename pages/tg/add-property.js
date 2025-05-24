import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import MultiStepPropertyForm from '../../components/iacomponents/NewProperty/MultiStepPropertyForm'

import { getSession, useSession } from "next-auth/react";


const AddPropertyPage = () => {

  const { data: session } = useSession();
  
  return (
    <RealEstatePageLayout
      pageTitle="Lister un bien immobilier"
      activeNav="Vendor"
      userLoggedIn={session ? true : false}
    >
      <MultiStepPropertyForm />
    </RealEstatePageLayout>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  } else {
    return { props: { session } };
  }
}
export default AddPropertyPage
