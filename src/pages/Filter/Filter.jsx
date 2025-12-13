import AdvanceSearch from "../../components/AdvanceSearch/AdvanceSearch";   
import Banner from "../../components/Banner/Banner";
import FilterHotel from "../../components/Filter/FilterHotel";
import { useParams, useLocation } from "react-router-dom";
import "./filter.css";

const Filter = () => {
    const { slug } = useParams();
    const location = useLocation();
    const searchData = location.state || {};

    return (
        <>
            <Banner />
            <AdvanceSearch />
            <FilterHotel 
                locationSlug={slug}
                searchData={searchData}
            />
        </>
    )
}

export default Filter;