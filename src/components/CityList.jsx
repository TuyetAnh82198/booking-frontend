import { useState, useEffect, useCallback } from "react";
import { Card, Container, Col, Row } from "react-bootstrap";

import styles from "./city.module.css";

const CityList = () => {
  //state danh sách thành phố
  const [cities, setCities] = useState([]);
  //state tải ảnh
  const [imagesLoaded, setImagesLoaded] = useState(false);

  //Hàm lấy danh sách thành phố
  const fetchCities = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/cities/get`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setCities(data.result))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchCities(), []);

  //hàm đợi tải ảnh xong mới hiển thị dữ liệu về ảnh
  useEffect(() => {
    const checkAllImagesLoaded = () => {
      setImagesLoaded(true);
    };
    cities.forEach((city) => {
      const image = new Image();
      image.src = `${process.env.REACT_APP_BACKEND}${city.image}`;
      image.onload = checkAllImagesLoaded;
    });
  }, [cities]);

  return (
    <Container
      className="d-flex justify-content-between"
      style={{ position: "relative", top: "3.5rem" }}
    >
      {!imagesLoaded && <p>Loading...</p>}
      <Row>
        {cities.map((city) => (
          <Col key={city._id}>
            <Card className="text-white h-100 border-0">
              <Card.Img
                className="h-100 rounded-3"
                src={`${process.env.REACT_APP_BACKEND}${city.image}`}
                alt=""
              />
              {imagesLoaded && (
                <Card.ImgOverlay className="p-4 d-flex flex-column justify-content-end">
                  <Card.Title
                    className={`my-1 ${styles.title}`}
                    as="h2"
                    style={{ fontWeight: "bold" }}
                  >
                    {city.name}
                  </Card.Title>
                  <Card.Text className={styles.count} as="h4">
                    {city.count} properties
                  </Card.Text>
                </Card.ImgOverlay>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CityList;
