import { useState } from 'react'
import axios from 'axios'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionButton } from 'react-bootstrap/AccordionButton'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { getSession,useSession } from 'next-auth/react'
import { API_URL } from '../../utils/settings'



const AccountInfoPage = () => {
  registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  )
  const { data: session } = useSession()
  const [profile, setProfile] = useState([])
  const [name, setName] = useState('Kossi ADANOU')
  const [email, setEmail] = useState('contact@immoask.com')
  const [errorNotification, setErrorNotification] = useState('')
  const [successNotification, setSuccessNotification] = useState('')
  const [phone, setPhone] = useState('(228) 7045 3625')
  const [address, setAddress] = useState('')

  const CustomToggle = ({ eventKey }) => {
    const handleClick = useAccordionButton(eventKey, (e) => e.preventDefault())
    return (
      <OverlayTrigger placement='top' overlay={<Tooltip>Editer</Tooltip>}>
        <a href='#' className='nav-link py-0 me-n3' onClick={handleClick}>
          <i className='fi-edit'></i>
        </a>
      </OverlayTrigger>
    )
  }

  const handleProfileSubmit = async () => {
  if (!session?.user?.token) {
    setErrorNotification("Vous n'êtes pas connecté.")
    return
  }
  if (!profile.length || !profile[0].file) {
    setErrorNotification("Veuillez sélectionner une photo.")
    return
  }

  const sendingFormData = new FormData()

  sendingFormData.append(
    'operations',
    JSON.stringify({
      query: `
        mutation UpdateProfile($data: UpdateProfileInput!) {
          updateUserProfile(input: $data) {
            status
            message
          }
        }
      `,
      variables: {
        data: {
          avatar: null // Must be null here, will be injected by map
        }
      }
    })
  )

  sendingFormData.append('map', JSON.stringify({ '0': ['variables.data.avatar'] }))
  sendingFormData.append('0', profile[0].file) // actual file

  try {
    const response = await axios.post(API_URL, sendingFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${session.user.token}`,
      },
    })

    const result = response.data.data?.updateUserProfile

    if (result?.status === 'SUCCESS') {
      setSuccessNotification('Vos informations ont été mises à jour avec succès.')
    } else {
      setErrorNotification(result?.message || 'Une erreur est survenue.')
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error)
    setErrorNotification('Erreur de connexion. Veuillez réessayer.')
  }
}


    

  const handleIdentitySubmit = async () => {
    
    try {
      const payload = {
        name,
        email,
        phone,
        address,
        profile: profile.length ? profile[0].file.name : null,
      }

      console.log('Submitting payload:', payload)

      // Simulate backend call
      const response = await axios.post('/api/account/update', payload)

      if (response.status === 200) {
        alert('Vos informations ont été mises à jour avec succès.')
      } else {
        alert('Une erreur est survenue.')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error)
      alert('Erreur de connexion. Veuillez réessayer.')
    }
  }

  return (
    <RealEstatePageLayout pageTitle='Compte' activeNav='Account' userLoggedIn>
      <RealEstateAccountLayout accountPageTitle='Informations personnelles'>
        <h1 className='h2'>Informations personnelles</h1>
        {errorNotification && (
          <div className='alert alert-danger'>
            {errorNotification}
          </div>
        )}
        {successNotification && (
          <div className='alert alert-success'>
            {successNotification}
          </div>
        )}
        <label className='form-label pt-2' htmlFor='account-bio'>Votre photo de profil</label>
        <Row className='pb-2'>
          <Col sm={12} lg={12} className='mb-4'>
            <FilePond
              files={profile}
              onupdatefiles={setProfile}
              name='profile'
              labelIdle='<i class="d-inline-block fi-camera-plus fs-2 text-muted mb-2"></i><br><span class="fw-bold">Mettre à jour votre photo</span>'
              acceptedFileTypes={['image/png', 'image/jpeg']}
              stylePanelLayout='compact'
              imagePreviewHeight={160}
              imageCropAspectRatio='1:1'
              imageResizeTargetWidth={200}
              imageResizeTargetHeight={200}
              className='file-uploader bg-secondary'
            />
          </Col>
        </Row>
        <div className='d-flex align-items-center justify-content-between mb-2 pb-3'>
          <Button className='px-3 px-sm-4' onClick={handleProfileSubmit}>
            Mettre à jour le profil
          </Button>
        </div>

        <Accordion className='border rounded-3 p-3 mb-4'>
          {/* Name */}
          <div className='border-bottom pb-3 mb-3'>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='pe-2'>
                <h2 className='form-label fw-bold'>Nom complet</h2>
                <p className='mb-0'>{name || 'Non spécifié'}</p>
              </div>
              <CustomToggle eventKey='name' />
            </div>
            <Accordion.Collapse eventKey='name'>
              <FormControl className='mt-3' value={name} onChange={(e) => setName(e.target.value)} placeholder='Entrer votre nom complet' />
            </Accordion.Collapse>
          </div>

          {/* Email */}
          <div className='border-bottom pb-3 mb-3'>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='pe-2'>
                <h2 className='form-label fw-bold'>Email</h2>
                <p className='mb-0'>{email || 'Non spécifié'}</p>
              </div>
              <CustomToggle eventKey='email' />
            </div>
            <Accordion.Collapse eventKey='email'>
              <FormControl type='email' className='mt-3' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Entrer votre email' />
            </Accordion.Collapse>
          </div>

          {/* Phone */}
          <div className='border-bottom pb-3 mb-3'>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='pe-2'>
                <h2 className='form-label fw-bold'>Téléphone</h2>
                <p className='mb-0'>{phone || 'Non spécifié'}</p>
              </div>
              <CustomToggle eventKey='phone' />
            </div>
            <Accordion.Collapse eventKey='phone'>
              <FormControl type='tel' className='mt-3' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Entrer votre numéro' />
            </Accordion.Collapse>
          </div>
          <div>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='pe-2'>
                <h2 className='form-label fw-bold'>Adresse</h2>
                <p className='mb-0'>{address || 'Non spécifié'}</p>
              </div>
              <CustomToggle eventKey='address' />
            </div>
            <Accordion.Collapse eventKey='address'>
              <FormControl className='mt-3' value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Entrer votre adresse' />
            </Accordion.Collapse>
          </div>
          {/* Address */}
        </Accordion>
        <div className='d-flex align-items-center justify-content-between mb-2 pb-3'>
          <Button className='px-3 px-sm-4' onClick={handleIdentitySubmit}>
            Mettre à jour les identités
          </Button>
        </div>

      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }
  return { props: { session } }
}

export default AccountInfoPage