import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import useListTowns from "../../customHooks/useListTowns";
import LocationsOptions from "./LocationsOptions";

export default function TownList({country_code}) {
  const { status, data:towns, error, isFetching,isLoading,isError }  = useListTowns(country_code)
  if(isLoading) return <LoadingSpinner/>
  return <LocationsOptions locations={towns}/>
}

/* function ProductItem({product}) {
  const price = formatProductPrice(product);
  return (
    <div className="p-4 md:w-1/3">
      <div className="h-full overflow-hidden border-2 border-gray-800 rounded-lg">
        
        <Link to={`/${product.id}`}>
          <img
            className="object-cover object-center w-full lg:h-96 md:h-36"
            src={product.image}
            alt=""
          />
        </Link>
        <div className="p-6">
          <h2 className="mb-1 text-xs font-medium tracking-widest text-gray-500 title-font">
            {product.category}
          </h2>
          <h1 className="mb-3 text-lg font-medium text-white title-font">
            {product.name}
          </h1>
          <p className="mb-3 leading-relaxed">{product.description}</p>
          <div className="flex flex-wrap items-center ">
            
            <Link to={`/${product.id}`}>
                <span className="inline-flex items-center text-indigo-400 md:mb-2 lg:mb-0">
                  Commander
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </span>
            </Link>
            <span className="inline-flex items-center py-1 pr-3 ml-auto mr-3 text-lg font-bold leading-none text-gray-500 border-gray-800 lg:ml-auto md:ml-0">
              {price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} */
