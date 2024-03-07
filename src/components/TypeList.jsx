import { useState, useEffect, useCallback } from "react";
import { Container, Image } from "react-bootstrap";

import styles from "./typelist.module.css";

const TypeList = () => {
  //state danh sách loại khách sạn
  const [types, setTypes] = useState([]);

  //Hàm lấy danh sách thành phố
  const fetchTypes = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/types/get`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setTypes(data.result))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchTypes(), [fetchTypes]);
  return (
    <Container style={{ position: "relative", top: "3.5rem" }}>
      <h4 style={{ margin: "2rem 0", fontWeight: "bold" }}>
        Browse by property type
      </h4>
      <div className="d-flex justify-content-between">
        {types.map((type) => (
          <div
            style={{
              width: "18.5%",
            }}
            key={type._id}
          >
            <Image
              className="rounded-top-3"
              style={{
                width: "100%",
                height: "60%",
              }}
              src={`${process.env.REACT_APP_BACKEND}${type.image}`}
              alt={type.name}
            />
            <h5
              className={styles.name}
              style={{ fontWeight: "bold", marginTop: "1rem" }}
            >
              {type.name}
            </h5>
            <p style={{ marginTop: "-0.5rem" }}>{type.count} hotels</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TypeList;
