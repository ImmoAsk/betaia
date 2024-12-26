import { useState, useImperativeHandle, useRef } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import axios from 'axios'
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import DatePicker from 'react-datepicker'
//Use of FIlePond
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import { getSession, useSession } from 'next-auth/react'
import 'react-datepicker/dist/react-datepicker.css'
import NumberFormat from 'react-number-format'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import moment from 'moment'
import { set } from 'nprogress'
import { API_URL } from '../../utils/settings'
var FormData = require('form-data');



const AddProjectPage = (props) => {
  // Register Filepond plugins
  registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  )

  // Gallery state
  const [files, setFiles] = useState([]);
  const [descriptionProjet, setDescriptionProjet] = useState("");
  const [categorieProjet, setCategorieProjet] = useState("");
  const [dateLivrable, setDateLivrable] = useState("");
  const { data: session, status } = useSession();
  const [validated, setValidated] = useState(false);
  const [projectNotification, setProjectNotification] = useState(null);

  const [sentFile, setSentFile] = useState(null);

  const [isFilePicked, setIsFilePicked] = useState(false);

  const [createObjectURL, setCreateObjectURL] = useState(null);


  //const filePondRef = useRef(null);
  var formData = new FormData();
  //return <input ref={inputRef} ... />

  const uploadToServer = async (event) => {

    event.stopPropagation();
    event.preventDefault();
    var projectData = `{user_id:${Number(session ? session.user.id : 0)},final_date:"${moment(dateLivrable).format('YYYY-MM-DD hh:mm:ss')}",start_date:"${moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}",statut:0,description:"${descriptionProjet}",project_name:"${categorieProjet.split(",")[1]}",project_category:"${categorieProjet.split(",")[0]}",project_document:"${sentFile}"}`
    let data = JSON.stringify({
      query: `mutation{createProject(input:${projectData}){id,description}}`,
      variables: {}
    });
    let config = {
      method: 'post',
      url: API_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios.request(config)
      .then((response) => {
        //var responseServer = JSON.stringify(response.data.data);
        if (response && response.data) {
          //console.log("Actual data:", response.data); // Log the data property
          var projectNotif = `Votre projet No. ${response.data.data.createProject.id} de ${categorieProjet}  est bien soumis.\nUn de nos commerciaux vous contacte d'ici peu`
          setProjectNotification(projectNotif);
        } else {
          console.error("Response data or data project is undefined");
        }
        setDescriptionProjet("");
        setDateLivrable("");
        setCategorieProjet("");
      })
      .catch((error) => {
        console.log(error);
      });
  }



  return (
    <RealEstatePageLayout
      pageTitle='Lancer un projet immobilier'
      userLoggedIn={session ? true : false}
    >


      {/* Page container */}
      <Container className='mt-5 mb-md-4 py-5'>
        <Row>
          {/* Page content */}
          <Col lg={6}>

            {/* Breadcrumb */}
            <Breadcrumb className='mb-3 pt-2 pt-lg-3'>
              <Link href='/tg' passHref>
                <Breadcrumb.Item>Accueil</Breadcrumb.Item>
              </Link>
              <Breadcrumb.Item active>Lancer un projet immobilier</Breadcrumb.Item>
            </Breadcrumb>

            {/* Title */}
            <div className='mb-4'>
              <h1 className='h2 mb-0'>Lancer un projet immobilier</h1>
              <div className='d-lg-none pt-3 mb-2'>65% content filled</div>
              <ProgressBar variant='warning' now={65} style={{ height: '.25rem' }} className='d-lg-none mb-4' />
            </div>
            {projectNotification &&
              (
                <>
                  <Alert variant='success' className='d-flex mb-4'>
                    <i className='fi-alert-circle me-2 me-sm-3'></i>
                    <p className='fs-sm mb-1'>{projectNotification}</p>
                  </Alert>
                </>
              )
            }
            <Form noValidate validated={validated} name="project-form" method="POST" encType="multipart/form-data">
              {/* Property details */}
              <section id='details' className='card card-body border-0 shadow-sm p-4 mb-4'>
                <h2 className='h4 mb-4'>
                  <i className='fi-edit text-primary fs-5 mt-n1 me-2'></i>
                  Détails sur le projet immobilier
                </h2>

                <Row>
                  <Form.Group as={Col} sm={6} controlId='categorieProjet' className='mb-3'>
                    <Form.Label>Catégorie du projet immobilier<span className='text-danger'>*</span></Form.Label>
                    <Form.Select defaultValue='' required onChange={(e) => { setCategorieProjet(e.target.value) }} name='categorieProjet'>
                      <option value='' disabled>Quel type de projet immobilier</option>
                      <option value='Suivi,Chantier'>Suivi d'un chantier</option>
                      <option value='Construction,Habitation personnelle'>Construction d'une habitation perso</option>
                      <option value='Construction,Immeuble commercial'>Construction d'un immeuble commercial</option>
                      <option value='Consruction, Hotel'>Construction d'un hotel</option>
                      <option value="Logement,Location d'appartement">Location d'appartement</option>
                      <option value="Logement,Location de villa">Location de villa</option>
                      <option value="Bail,Location de bureau">Location de bureau</option>
                      <option value="Bail,Location de magasin">Location de magasin</option>
                      <option value="Bail,Location de boutique">Location de boutique</option>
                      <option value="Bail,Location de terrain">Location de terrain</option>
                      <option value="Sejour,Reservation de sejour">Reservation de sejour meuble</option>
                      <option value='Achat,Terrain rural'>Achat d'un terrain rural</option>
                      <option value='Achat,Terrain urbain'>Achat d'un terrain urbain</option>
                      <option value='Achat,Achat de Villa'>Achat de villa</option>
                      <option value="Achat,Achat d\'appartement">Achat d'appartement</option>
                      <option value='Accompagnement,Titre foncier'>Obtention de titre foncier</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Préciser la catégorie du projet immobilier, svp
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId='ap-city' className='mb-3'>
                    <Form.Label>Délai d'urgence <span className='text-danger'>*</span></Form.Label>
                    {/* <InputGroup className='' style={{ maxWidth: '100%' }}>
                      <span class="input-group-text">
                        <i class="fi-calendar"></i>
                      </span>
                      <Form.Control
                        as={DatePicker}
                        selected={dateLivrable}
                        minDate={new Date()}
                        onChange={(date) => setDateLivrable(date)}
                        placeholderText='Selectionner une date'
                        data-datepicker-options='{"altInput": true, "altFormat": "F j, Y", "dateFormat": "Y-m-d"}'
                      />
                    </InputGroup> */}
                    {/* <div class="input-group">
                      <input as={DatePicker} onChange={(e) => { setDateLivrable(e.target.value) }} class="form-control date-picker rounded pe-5" type="text" placeholder="Selectionner une date" data-datepicker-options='{"altInput": true, "altFormat": "F j, Y", "dateFormat": "Y-m-d"}' />
                      <i class="fi-calendar position-absolute top-50 end-0 translate-middle-y me-3"></i>
                    </div> */}
                    <InputGroup className='flex-shrink-0 d-inline-flex align-middle me-3 mb-3 w-100'>
                      <FormControl
                        as={DatePicker}
                        selected={dateLivrable}
                        minDate={new Date()}
                        onChange={(date) => setDateLivrable(date)}
                        placeholderText='Selectionner une date'
                        size='md'
                        className='ps-5'
                      />
                      <i className='fi-calendar position-absolute top-50 start-0 translate-middle-y ms-3 ps-1'></i>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" tooltip>
                      Indiquez nous un délai d'urgence
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Form.Group controlId='descriptionProjet'>
                  <Form.Label>Description <span className='text-danger'>*</span></Form.Label>
                  <Form.Control as='textarea' rows={5} required placeholder='Décrire votre projet immobilier' onChange={(e) => { setDescriptionProjet(e.target.value) }} name='descriptionProjet' />
                  <Form.Text>1500 characters left</Form.Text>
                  <Form.Control.Feedback type="invalid" tooltip>
                    SVP, décrivez légèrement votre projet immobilier
                  </Form.Control.Feedback>
                </Form.Group>

              </section>
              {/* Photos / video */}
              <section id='photos' className='card card-body border-0 shadow-sm p-4 mb-4'>
                <h2 className='h4 mb-4'>
                  <i className='fi-image text-primary fs-5 mt-n1 me-2'></i>
                  Esquisses ou plan et copie des documents légaux
                </h2>
                <Alert variant='info' className='d-flex mb-4'>
                  <i className='fi-alert-circle me-2 me-sm-3'></i>
                  <p className='fs-sm mb-1'>Un fichier esquisse du projet. Obligatoire si vous
                    soumettez un projet immobilier de construction, de suivi de chantier etc...</p>
                </Alert>
                <FilePond
                  files={files ? files : []}
                  onupdatefiles={setFiles}
                  allowMultiple={false}
                  dropOnPage
                  server={{
                    process: {
                      url: `https://immoaskbetaapi.omnisoft.africa/public/api/v2`,
                      ondata: () => {
                        formData.append('operations', `{"query":"mutation($file:Upload!){Upload(file: $file)}"}`)
                        formData.append('map', '{"0": ["variables.file"]}')
                        formData.append("0", files[0].file);
                        return formData;
                      },
                      onload: (response) => {
                        console.log("Server:", response);
                        if (response) {
                          var parsedData = JSON.parse(response)
                          var uploadData = JSON.parse(parsedData.data.Upload);
                          const hashFileNane = uploadData.hashName;
                          setSentFile(hashFileNane);
                          console.log("Project file name:", uploadData.hashName)

                        } else {
                          console.error("Response data or data project is undefined");
                        }
                      },
                    }
                  }}
                  name="files"
                  dropValidation
                  required={false}
                  labelIdle='<div class="btn btn-primary mb-3"><i class="fi-cloud-upload me-1"></i>Upload photos / video</div><div>or drag them in</div>'
                  //labelIdle={`<span class="filepond--label-action"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><defs><path id="a" d="M24 24H0V0h24v24z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"/></svg><span>Add an image</span></span>`}
                  acceptedFileTypes={['image/png', 'image/jpeg', 'video/mp4', 'video/mov']}
                  maxFileSize='2MB'
                  className='file-uploader file-uploader-grid'
                />

              </section>
              {projectNotification &&
                (
                  <>
                    <Alert variant='success' className='d-flex mb-4'>
                      <i className='fi-alert-circle me-2 me-sm-3'></i>
                      <p className='fs-sm mb-1'>{projectNotification}</p>
                    </Alert>
                  </>
                )
              }

              {/* Contacts */}


              {/* Action buttons */}
              <section className='d-sm-flex justify-content-between pt-2'>
                <Button size='lg' variant='primary d-block w-100 w-sm-auto mb-2' type="submit" onClick={uploadToServer}>Enregistrer et soumettre</Button>
                {/* <Button size='lg' variant='primary d-block w-100 w-sm-auto mb-2' type="submit" onClick={uploadToServer}>Enregistrer et soumettre</Button> */}
              </section>
            </Form>

          </Col>
        </Row>
      </Container>
    </RealEstatePageLayout>
  )
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
  }
  else {
    return { props: { session } };
  }
}
export default AddProjectPage