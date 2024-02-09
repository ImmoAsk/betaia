import { useState } from 'react';
import { Card, Badge, Dropdown } from 'react-bootstrap';
import RProjectReplyModal from './RProjectReplyModal';

const PropertyProject = ({ project }) => {

    const [editPropertyShow, setEditPropertyShow] = useState(false);
    const handleEditPropertyClose = () => setEditPropertyShow(false);
    const handleEditPropertyShow = () => setEditPropertyShow(true);
    return (

        <div className="pb-2">
            {
                editPropertyShow && <RProjectReplyModal
                    centered
                    size='lg'
                    show={editPropertyShow}
                    onHide={handleEditPropertyClose}
                    project={project}
                />
            }
            <Card className="bg-secondary card-hover">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                            <span className="fs-sm text-dark opacity-80 px-1">{project.project_name}</span>
                            <Badge bg="faded-accent" className="rounded-pill fs-sm ms-2">{project.project_category}</Badge>
                        </div>
                        <Dropdown className="content-overlay">
                            <Dropdown.Toggle variant="light" className="btn btn-icon btn-light btn-xs rounded-circle shadow-sm" id="contextMenu">
                                <i className="fi-dots-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="my-1" aria-labelledby="contextMenu">

                                {project.statut === 1 &&
                                    <Dropdown.Item onClick={(event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        handleEditPropertyShow();
                                    }}>
                                        <i className="fi-heart opacity-60 me-2"></i>
                                        Repondre au projet
                                    </Dropdown.Item>
                                }
                                {project.statut === 2 &&
                                    <Dropdown.Item>
                                        <i className="fi-heart opacity-60 me-2"></i>
                                        Mettre en archive
                                    </Dropdown.Item>
                                }
                                {project.statut === 3 &&
                                    <Dropdown.Item>
                                        <i className="fi-heart opacity-60 me-2"></i>
                                        Supprimer
                                    </Dropdown.Item>
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <h3 className="h6 card-title pt-1 mb-3">
                        <a href="#" className="text-nav stretched-link text-decoration-none">{project.description}</a>
                    </h3>
                    <div className="fs-sm">
                        <span className="text-nowrap me-3">
                            <i className="fi-calendar text-muted me-1"> </i>
                            {project.final_date}
                        </span>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PropertyProject;

/* 
export default function PropertyProject({ project }) {

    return (
        <div className="pb-2">
            <div className="card bg-secondary card-hover">
                <div class="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                            <span className="fs-sm text-dark opacity-80 px-1">{project.project_name}</span>
                            <span className="badge bg-faded-accent rounded-pill fs-sm ms-2">{project.project_category}</span>
                        </div>
                        <div className="dropdown content-overlay">
                            <button type="button" className="btn btn-icon btn-light btn-xs rounded-circle shadow-sm" id="contextMenu" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fi-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu my-1" aria-labelledby="contextMenu">
                                <li>
                                    <button type="button" className="dropdown-item">
                                        <i className="fi-heart opacity-60 me-2"></i>
                                        Traiter
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="dropdown-item">
                                        <i className="fi-x-circle opacity-60 me-2"></i>
                                        Archiver
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <h3 className="h6 card-title pt-1 mb-3">
                        <a href="#" className="text-nav stretched-link text-decoration-none">{project.description}</a>
                    </h3>
                    <div className="fs-sm">
                        <span className="text-nowrap me-3">
                            <i className="fi-calendar text-muted me-1"> </i>
                            {project.final_date}
                        </span>
                        <span className="text-nowrap me-3">
                            <i className="fi-cash fs-base text-muted me-1"></i>
                            {project.statut}
                        </span>
                        {project.statut===1 &&
                            <span className="text-nowrap me-3">
                            <i className="fi-cash fs-base text-muted me-1"></i>
                            Repondre
                        </span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )

} */