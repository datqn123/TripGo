import React from 'react'
import "../Cards/card.css";
import { Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const PopularCard = ({val}) => {
  return (
    <>
        <Card className="rounded-2 shadow-sm popular">
              <Card.Img
                variant="top"
                src={val.thumbnail}
                className="img-fluid"
                alt={val.name || "hotel"}
              />
              <Card.Body>
              
                <Card.Text>
                  <i className="bi bi-geo-alt"></i>
                  <span className="text">{val.locationName}</span>
                </Card.Text>

                <Card.Title>
                  <NavLink className="body-text text-dark text-decoration-none" to="/tour-details">
                    {val.name}
                  </NavLink>
                </Card.Title>

                <p className="reviwe">
                  <span>
                    <i className="bi bi-star-fill me-1"></i>
                  </span>
                  <span>{val.starRating} sao</span>
                </p>

                {val.hotelType && (
                  <span className={val.hotelType.replace(/ .*/, "") + " badge"}>
                    {val.hotelType}
                  </span>
                )}
                
              </Card.Body>

              <Card.Footer className="py-4">
                <p className="mb-0">
                  Từ <b>{val.minPrice?.toLocaleString('vi-VN')} đ</b> / đêm
                </p>
              </Card.Footer>
            </Card>
    </>
  )
}

export default PopularCard
