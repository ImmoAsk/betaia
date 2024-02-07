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
import ImageLoader from '../../components/ImageLoader'
import ScrollLink from '../../components/ScrollLink'
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

  const [sentFile, setSentFile] = useState(null);

  const [isFilePicked, setIsFilePicked] = useState(false);

  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      //setFiles(i);
      setCreateObjectURL(URL.createObjectURL(i));
      console.log("Full url of image: ", createObjectURL);
      console.log(event.target.files[0]);
    }
  };


  //const filePondRef = useRef(null);
  var formData = new FormData();
  //return <input ref={inputRef} ... />
  
  const uploadToServer = async (event) => {

    event.stopPropagation();
    event.preventDefault();

    console.log("Image from c to s:", files[0].filename);
    //const [createObjectURL, setCreateObjectURL] = useState(null);
    console.log("Full url: ", createObjectURL);
    //console.log("Description:",descriptionProjet);
    var projectData = `{user_id:${Number(session ? session.user.id : 0)},final_date:"${dateLivrable}",start_date:"${moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}",statut:1,description:"${descriptionProjet}",project_name:"${categorieProjet.split(",")[1]}",project_category:"${categorieProjet.split(",")[0]}",project_document:""}`
    /* const handleSubmit = async event => {
        event.preventDefault();
        try {
            // Make an HTTP request to submit the form data
            const response = await axios.post('your-api-endpoint', formData);
  
            // Extract the response data from the server response
            const responseData = response.data;
  
            // Update the state with the response data
            setResponseData(responseData);
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error('Error submitting form:', error);
        }
    }; */

    let data = JSON.stringify({
      query: `mutation{createProject(input:${projectData}){id,description}}`,
      variables: {}
    });

    formData.append('map', '{"0": ["variables.file"]}');
    formData.append('operations', `{"query":"mutation($file:Upload!){Upload(file: $file)}"}`)
    formData.append("0", files);

    await fetch(
      "https://immoaskbetaapi.omnisoft.africa/public/api/v2", { method: "POST", body: formData }).then((response) => response.json())
      .then((response) => {
        setSentFile(response.data.Upload.hashName);
      }).
      catch((error) => {
        console.error('Error:', error)
      });

    let config = {
      method: 'post',
      url: 'https://immoaskbetaapi.omnisoft.africa/public/api/v2',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
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
                      <option value='Achat,Terrain rural'>Achat d'un terrain rural</option>
                      <option value='Achat,Terrain urbain'>Achat d'un terrain urbain</option>
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
                    <div class="input-group">
                      <input as={DatePicker} onChange={(e) => { setDateLivrable(e.target.value) }} class="form-control date-picker rounded pe-5" type="text" placeholder="Selectionner une date" data-datepicker-options='{"altInput": true, "altFormat": "F j, Y", "dateFormat": "Y-m-d"}' />
                      <i class="fi-calendar position-absolute top-50 end-0 translate-middle-y me-3"></i>
                    </div>
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
                  <p className='fs-sm mb-1'>The maximum photo size is 8 MB. Formats: jpeg, jpg, png. Put the main picture first.<br />
                    The maximum video size is 10 MB. Formats: mp4, mov.</p>
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
                        var jsonResponse= JSON.parse(response);
                        console.log(jsonResponse);
                        var jsonStringfy= JSON.stringify(jsonResponse, null, 2);
                        
                        console.log(jsonStringfy);

                        //var filename1= jsonStringfy.data.Upload.hashName;
                        var filename= jsonResponse.data.Upload.hashName;
                        //console.log('File name 1:',filename1);
                        console.log('File name:',filename);
                      },
                    }
                  }}
                  name="files"
                  dropValidation
                  labelIdle='<div class="btn btn-primary mb-3"><i class="fi-cloud-upload me-1"></i>Upload photos / video</div><div>or drag them in</div>'
                  //labelIdle={`<span class="filepond--label-action"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><defs><path id="a" d="M24 24H0V0h24v24z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"/></svg><span>Add an image</span></span>`}
                  acceptedFileTypes={['image/png', 'image/jpeg', 'video/mp4', 'video/mov']}
                  maxFileSize='2MB'
                  className='file-uploader file-uploader-grid'
                />
                {/* <Form.Group className="position-relative mb-3">
                <Form.Control
                  type="file"
                  required
                  name="image"
                  onChange={uploadToClient}
                />
              </Form.Group> */}

              </section>


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
