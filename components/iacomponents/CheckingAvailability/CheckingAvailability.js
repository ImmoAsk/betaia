import { Card, Badge } from 'react-bootstrap';
import { formatDate } from '../../../utils/generalUtils';
import { useSession } from 'next-auth/react';

const getBadgeProps = (statut) => {
    switch (statut) {
        case 0:
            return { text: "Nouvelle", variant: "faded-accent" };
        case 1:
            return { text: "Acceptée", variant: "faded-accent success" };
        case 2:
            return { text: "Refusée", variant: "faded-accent danger" };
        default:
            return { text: "Visite", variant: "faded-accent" };
    }
};

const updateNegotiation = async ({ negociationOffer, statut }) => {
    if (!negociationOffer || !negociationOffer.id) {
        console.error("Invalid negotiation offer.");
        return null;
    }

    try {
        const url = `https://immoaskbetaapi.omnisoft.africa/public/api/v2?query=mutation{updateVerificationDisponibilite(input:{id:${Number(negociationOffer.id)},statut:${statut}}){statut}}`;
        const response = await fetch(url
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const responseData = await response.json();
        if (!responseData.data) throw new Error("Failed to update negotiation.");
        return responseData.data.updateNegotiation;
    } catch (error) {
        console.error("Error updating negotiation:", error);
        return null;
    }
};

const CheckingAvailability = ({ project }) => {
    const { text, variant } = getBadgeProps(project?.statut);
    const { data: session } = useSession();
    const role = session?.user?.roleId;

    const handleAccept = async () => {
        const response = await updateNegotiation({ negociationOffer: project, statut: 1 });
        if (response) console.log('Accepted the project:', project.id);
    };

    const handleDecline = async () => {
        const response = await updateNegotiation({ negociationOffer: project, statut: 2 });
        if (response) console.log('Declined the project:', project.id);
    };

    return (
        <div className="pb-2">
            <Card className="bg-secondary card-hover">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                            <Badge bg={variant} className="rounded-pill fs-sm ms-2">{text}</Badge>
                        </div>
                    </div>
                    <h3 className="h6 card-title pt-1 mb-3">
                        <p className="text-nav text-decoration-none">
                            <strong>
                                {project.fullname_verificateur || project.verificateur?.name}
                            </strong>{" "}
                            {role === '1200' || role === '1233' || role === '1234' || role === '1235' && (project.telephone_verificateur ? `+${project.telephone_verificateur}` :  project.verificateur?.phone)} souhaite vérifier la disponibilité de la propriété No. {project.propriete.nuo}
                        </p>
                    </h3>
                    <div className="fs-sm">
                        <span className="text-nowrap me-3">
                            <i className="fi-calendar text-muted me-1"></i>
                            {formatDate(project.created_at)}
                        </span>
                    </div>
                    {(role === '1230' || role === '1200' || role === '1233' || role === '1234' || role === '1235') && project.statut === 0 && (
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            className="btn btn-outline-secondary me-2 flex-grow-1"
                            onClick={handleDecline}
                        >
                            Déjà occupé
                        </button>
                        <button
                            className="btn btn-primary flex-grow-1"
                            onClick={handleAccept}
                        >
                            Libre pour visite
                        </button>
                    </div>
                )}
                </Card.Body>
                
            </Card>


        </div>
    );
};

export default CheckingAvailability;