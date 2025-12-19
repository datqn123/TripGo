import AdvanceSearch from "../../components/AdvanceSearch/AdvanceSearch";   
import Banner from "../../components/Banner/Banner";
import FilterHotel from "../../components/Filter/FilterHotel";
import FilterPlane from "../../components/Filter/FilterPlane";
import FilterTour from "../../components/Filter/FilterTour";
import { useParams, useLocation } from "react-router-dom";
import "./filter.css";

const Filter = ({type}) => {
    const location = useLocation();
    const searchData = location.state || {};

    return (
        <>
            <Banner />
            <AdvanceSearch />
            {/* <FilterHotel 
                locationSlug={slug}
                searchData={searchData}
            /> */}
            {type === "hotel" && <FilterHotel searchData={searchData} />}
            {type === "tour" && <FilterTour />}
            {type === "plane" && <FilterPlane/>}
        </>
    )
}

export default Filter;