import PropertyVisit from "./PropertyVisit";

export default function PropertyVisitList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <PropertyVisit project={project} key={indx} />
            </>
        )))
    



}