import CheckingAvailability from "./CheckingAvailability";
export default function CheckingAvailabilityList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <CheckingAvailability project={project} key={indx} />
            </>
        )))
    



}