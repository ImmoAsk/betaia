import { useRouter } from "next/router";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getSession } from "next-auth/react";
import RealEstatePageLayout from "../../components/partials/RealEstatePageLayout";
import RealEstateAccountLayout from "../../components/partials/RealEstateAccountLayout"

const CongratulationsPage = () => {
  const router = useRouter();
  const { propertyId } = router.query;

  return (
    <RealEstatePageLayout
      pageTitle="Property posted, congrats"
      activeNav="Account"
      userLoggedIn
    >
      <RealEstateAccountLayout accountPageTitle="Property posted, congrats">
        <Container className="py-5 mt-5 mb-md-4">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="text-center shadow-sm">
                <Card.Body className="p-5">
                  <div
                    style={{ fontSize: "3rem", color: "green" }}
                    className="mb-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      fill="currentColor"
                      className="bi bi-check-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                  </div>
                  <h1 className="mb-3">Félicitations !</h1>
                  <p className="lead mb-4">
                    Votre propriété {propertyId ? `(ID: ${propertyId})` : ""} a
                    été soumise avec succès et les agents sélectionnés ont été
                    notifiés.
                  </p>
                  <p className="mb-4">
                    Vous pouvez maintenant consulter toutes vos propriétés ou
                    ajouter une nouvelle annonce.
                  </p>
                  <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <Link href="/tg/account-properties" passHref legacyBehavior>
                      <Button variant="primary" size="lg" as="a">
                        Voir Mes Propriétés
                      </Button>
                    </Link>
                    <Link href="/create-property" passHref legacyBehavior>
                      <Button variant="outline-secondary" size="lg" as="a">
                        Ajouter une Autre Propriété
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

export default CongratulationsPage;