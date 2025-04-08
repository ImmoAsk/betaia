import Souscription from "./Souscription";
export default function SouscriptionsList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <Souscription project={project} key={indx} />
            </>
        )))
    



}