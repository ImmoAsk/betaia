import FurnishedBooking from "./FurnishedBooking";

export default function RentingNegotiationOfferList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <FurnishedBooking project={project} key={indx} />
            </>
        )))
    



}