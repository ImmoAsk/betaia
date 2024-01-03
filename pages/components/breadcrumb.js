// Breadcrumb component documentation page with code examples

import ComponentPageLayout from '../../components/partials/ComponentPageLayout'
import ComponentPageSection from '../../components/partials/ComponentPageSection'
import Link from 'next/link'
import Tab from 'react-bootstrap/Tab'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Code from '../../components/Code'

const BreadcrumbPage = () => {

  const anchorLinks = [
    {
      label: 'Dark (default) version',
      anchor: 'breadcrumb-dark'
    },
    {
      label: 'Light version',
      anchor: 'breadcrumb-light'
    }
  ]

  return (
    <ComponentPageLayout
      pageTitle='Breadcrumb'
      pageDescription='Indicate the current page’s location within a navigational hierarchy.'
      activeNav='/components/breadcrumb'
      docsLink='https://react-bootstrap.github.io/components/breadcrumb/'
      docsLinkLabel='React Bootstrap docs'
      anchorLinks={anchorLinks}
    >

      {/* Dark (default) version */}
      <ComponentPageSection id='breadcrumb-dark' title='Dark (default) version'>
        <Tab.Pane eventKey='preview'>
          <Breadcrumb>
            <Link href='#' passHref>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Link>
            <Link href='#' passHref>
              <Breadcrumb.Item>Library</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Data</Breadcrumb.Item>
          </Breadcrumb>
          <Breadcrumb>
            <Link href='#' passHref>
              <Breadcrumb.Item>
                <i className='fi-home'></i>
              </Breadcrumb.Item>
            </Link>
            <Link href='#' passHref>
              <Breadcrumb.Item>Library</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Data</Breadcrumb.Item>
          </Breadcrumb>
        </Tab.Pane>
        <Tab.Pane eventKey='code'>
          <Code language='jsx'>{`import Link from 'next/link'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

{/* Basic example. Make sure to wrap <Breadcrumb.Item> with Next <Link href='#' passHref> component so the links work as expected without page reload. */}
<Breadcrumb>
  <Link href='#' passHref>
    <Breadcrumb.Item>Home</Breadcrumb.Item>
  </Link>
  <Link href='#' passHref>
    <Breadcrumb.Item>Library</Breadcrumb.Item>
  </Link>
  <Breadcrumb.Item active>Data</Breadcrumb.Item>
</Breadcrumb>

{/* Home icon */}
<Breadcrumb>
  <Link href='#' passHref>
    <Breadcrumb.Item>
      <i className='fi-home'></i>
    </Breadcrumb.Item>
  </Link>
  <Link href='#' passHref>
    <Breadcrumb.Item>Library</Breadcrumb.Item>
  </Link>
  <Breadcrumb.Item active>Data</Breadcrumb.Item>
</Breadcrumb>`}</Code>
        </Tab.Pane>
      </ComponentPageSection>


      {/* Light version */}
      <ComponentPageSection id='breadcrumb-light' title='Light version'>
        <Tab.Pane eventKey='preview' className='m-n3 p-3 bg-dark'>
          <Breadcrumb className='breadcrumb-light'>
            <Link href='#' passHref>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Link>
            <Link href='#' passHref>
              <Breadcrumb.Item>Library</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Data</Breadcrumb.Item>
          </Breadcrumb>
          <Breadcrumb className='breadcrumb-light'>
            <Link href='#' passHref>
              <Breadcrumb.Item>
                <i className='fi-home'></i>
              </Breadcrumb.Item>
            </Link>
            <Link href='#' passHref>
              <Breadcrumb.Item>Library</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Data</Breadcrumb.Item>
          </Breadcrumb>
        </Tab.Pane>
        <Tab.Pane eventKey='code'>
          <Code language='jsx'>{`import Link from 'next/link'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

{/* Light version. Make sure to wrap <Breadcrumb.Item> with Next <Link href='#' passHref> component so the links work as expected without page reload. */}
<Breadcrumb className='breadcrumb-light'>
  <Link href='#' passHref>
    <Breadcrumb.Item>Home</Breadcrumb.Item>
  </Link>
  <Link href='#' passHref>
    <Breadcrumb.Item>Library</Breadcrumb.Item>
  </Link>
  <Breadcrumb.Item active>Data</Breadcrumb.Item>
</Breadcrumb>

{/* Home icon */}
<Breadcrumb className='breadcrumb-light'>
  <Link href='#' passHref>
    <Breadcrumb.Item>
      <i className='fi-home'></i>
    </Breadcrumb.Item>
  </Link>
  <Link href='#' passHref>
    <Breadcrumb.Item>Library</Breadcrumb.Item>
  </Link>
  <Breadcrumb.Item active>Data</Breadcrumb.Item>
</Breadcrumb>`}</Code>
        </Tab.Pane>
      </ComponentPageSection>
    </ComponentPageLayout>
  )
}

export default BreadcrumbPage
