import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../AdvanceSearch/advancesearch.css";
import { Container, Row, Col, Button } from "react-bootstrap";
// import
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import HotelSearch from "./HotelSearch";
import PlaneSearch from "./PlaneSearch";
import TourSearch from "./TourSearch";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const AdvanceSearch = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const selectedLocation = (value) => {
    console.log("Location", value);
  };

  const selectedGuest = (value) => {
    console.log("Guest ", value);
  };

  return (
    <>
      <section className="box-search-advance">
        <Container>
          <Row>
            <Col md={12} xs={12}>
              <div className="box-search shadow-sm">
                <Tabs
                  defaultActiveKey="hotel"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="hotel" title="Khách sạn">
                    <HotelSearch />
                  </Tab>
                  <Tab eventKey="plane" title="Vé máy bay">
                    <PlaneSearch />
                  </Tab>
                  <Tab eventKey="tour" title="Tour du lịch">
                    <TourSearch />
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdvanceSearch;
