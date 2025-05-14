import { Col } from "react-bootstrap";
import PropertyInventory from "./PropertyInventory";

export default function PropertyInventoryList({ inventories }) {
    return(
        inventories && inventories.map((inventory, indx) => (
            <>
                <PropertyInventory inventory={inventory} key={indx} />
            </>
        )))
    



}