import { useState, useEffect, useCallback } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import styles from "./topHotels.module.css";

const TopHotels = () => {
  //state danh sách loại khách sạn
  const [hotels, setHotels] = useState([]);

  //Hàm lấy danh sách khách sạn nằm trong top 3 rating cao nhất
  const fetchHotels = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/hotels/get-top`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setHotels(data.result);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchHotels(), [fetchHotels]);

  const navigate = useNavigate();
  //Hàm chuyển hướng đến trang hiển thị chi tiết khách sạn
  const seeDetail = (id) => {
    const hotel = hotels.find((hotel) => hotel._id === id);
    navigate(`/detail/${id}`, { state: hotel });
  };
  return (
    <Container className={styles.component}>
      <h4 style={{ margin: "2rem 0", fontWeight: "bold" }}>
        Homes guests love
      </h4>
      <div className="d-flex justify-content-between">
        {hotels.map((hotel) => (
          <div
            style={{
              width: "32%",
            }}
            key={hotel._id}
          >
            <Image
              onClick={() => seeDetail(hotel._id)}
              style={{
                width: "100%",
                height: "60%",
                cursor: "pointer",
              }}
              src={hotel.photos[0]}
              alt={hotel.name}
            />
            <h5
              onClick={() => seeDetail(hotel._id)}
              className={styles.name}
              style={{
                color: "#4b208d",
                fontWeight: "bold",
                marginTop: "1rem",
                cursor: "pointer",
              }}
            >
              {hotel.name}
            </h5>
            <p className="my-2" style={{ marginTop: "-0.5rem" }}>
              {hotel.city.name}
            </p>
            <h5 className={styles.price} style={{ marginBottom: "1rem" }}>
              Starting from ${hotel.cheapestPrice}
            </h5>
            <p>
              <span
                className={styles.rating}
                style={{
                  backgroundColor: "#00387f",
                  color: "white",
                  fontWeight: "bold",
                  padding: "0.25rem 0.5rem",
                }}
              >
                {hotel.rating}.0
              </span>{" "}
              Excellent
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TopHotels;
