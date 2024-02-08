import React from "react";
import { useMockPaginate } from "../../customHooks/usePagination";
import { getLastPage } from "../../utils/generalUtils";
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import RentingList from "./RentingList";
export default function IAPaginaation({ dataPagineted }) {
    const { nextPage, prevPage, paginatedData, currentPage } = useMockPaginate(dataPagineted, 9)
    return (
        <>
            <Row xs={1} sm={2} xl={3} className='g-4 py-4'>
                <RentingList rentingProperties={paginatedData} />
            </Row>
            <nav className='border-top pb-md-4 pt-4' aria-label='Pagination'>
                <Pagination className='mb-1'>
                    <Pagination.Item disabled={currentPage === 1 && true} onClick={prevPage}>
                        <i className='fi-chevron-left'></i>
                        Précédent
                    </Pagination.Item>
                    <Pagination.Item disabled={currentPage === getLastPage(dataPagineted.length) && true} onClick={nextPage}>
                        Suivant
                        <i className='fi-chevron-right'></i>
                    </Pagination.Item>
                </Pagination>
            </nav>
        </>
    );
}