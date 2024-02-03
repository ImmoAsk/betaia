

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
                            {project.start_date}
                        </span>
                        <span className="text-nowrap me-3">
                            <i className="fi-cash fs-base text-muted me-1"></i>
                            {project.statut}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )

}