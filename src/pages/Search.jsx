import { useState, useEffect, useCallback } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import styles from "./search.module.css";

const Search = () => {
  const location = useLocation();
  //   console.log(location.state);
  //state tên thành phố để tìm khách sạn
  const [destination, setDestination] = useState(
    location.state.destination ? location.state.destination : ""
  );
  //state ngày tháng muốn đặt phòng, được truyền từ trang chủ
  const [datePicked, setDatePicked] = useState(
    location.state.datePicked
      ? location.state.datePicked
      : [
          {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
          },
        ]
  );
  //state ngày tháng muốn đặt phòng, lấy từ thẻ input
  const [newDatePicked, setNewDatePicked] = useState(
    `${format(datePicked[0].startDate, "MM/dd/yyyy")} to ${format(
      datePicked[0].endDate,
      "MM/dd/yyyy"
    )}`
  );
  //state số lượng người lớn, trẻ em, phòng
  const [roomOption, setRoomOption] = useState(location.state.roomOption);
  //state danh sách khách sạn tìm được
  const [hotels, setHotels] = useState([]);

  const navigate = useNavigate();
  //Hàm hiển thị danh sách khách sạn theo điều kiện tìm kiếm ở trang chủ
  const fetchHotels = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/hotels/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        destination,
        datePicked: {
          startDate: format(datePicked[0].startDate, "yyyy-MM-dd"),
          endDate: format(datePicked[0].endDate, "yyyy-MM-dd"),
        },
        roomOption,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setHotels(data.result);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchHotels(), [fetchHotels]);

  //Hàm hiển thị danh sách khách sạn theo điều kiện tìm kiếm ngay tại trang /search
  const searchHotels = () => {
    if (destination.trim().length === 0) {
      alert("The destination cannot be empty!");
    } else {
      fetch(`${process.env.REACT_APP_BACKEND}/hotels/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          destination,
          datePicked: [
            {
              startDate: newDatePicked.split(" ")[0].slice(0, 11),
              endDate: newDatePicked.split(" ")[2].slice(0, 11),
            },
          ],
          roomOption,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setHotels(data.result);
          // console.log(data);
        })
        .catch((err) => console.log(err));
    }
  };

  //Hàm chuyển hướng đến trang hiển thị chi tiết khách sạn
  const seeDetail = (id) => {
    const hotel = hotels.find((hotel) => hotel._id === id);
    navigate(`/detail/${id}`, { state: hotel });
  };
  return (
    <Container className="my-3 d-flex justify-content-between">
      <div
        className="rounded-3 p-2 col-3"
        style={{ backgroundColor: "#feba0c" }}
      >
        <h3 style={{ color: "#505055" }}>Search</h3>
        <Form>
          <Form.Group>
            <Form.Label htmlFor="city">Destination</Form.Label>
            <Form.Control
              defaultValue={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="rounded-0"
              id="city"
              type="text"
            />
          </Form.Group>
          <Form.Group className="my-2">
            <Form.Label htmlFor="date">Check-in Date</Form.Label>
            <Form.Control
              defaultValue={`${format(
                datePicked[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(datePicked[0].endDate, "MM/dd/yyyy")}`}
              onChange={(e) => {
                setNewDatePicked(e.target.value);
              }}
              className="rounded-0"
              id="date"
              type="text"
            />
          </Form.Group>
          <Form.Group>
            <h6>Options</h6>
            <div className="py-2 px-3">
              <Row>
                <Col>
                  <Form.Label style={{ color: "#505055" }} htmlFor="adult">
                    Adult
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    defaultValue={roomOption.adult}
                    onChange={(e) =>
                      setRoomOption((prevState) => {
                        return { ...prevState, adult: e.target.value };
                      })
                    }
                    className="rounded-0 border-dark"
                    id="adult"
                    type="number"
                  />
                </Col>
              </Row>
              <Row className="my-2">
                <Col>
                  <Form.Label style={{ color: "#505055" }} htmlFor="children">
                    Children
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    defaultValue={roomOption.children}
                    onChange={(e) =>
                      setRoomOption((prevState) => {
                        return { ...prevState, children: e.target.value };
                      })
                    }
                    className="rounded-0 border-dark"
                    id="children"
                    type="number"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label style={{ color: "#505055" }} htmlFor="room">
                    Room
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    defaultValue={roomOption.room}
                    onChange={(e) =>
                      setRoomOption((prevState) => {
                        return { ...prevState, room: e.target.value };
                      })
                    }
                    className="rounded-0 border-dark"
                    id="room"
                    type="number"
                  />
                </Col>
              </Row>
            </div>
          </Form.Group>
          <Button
            onClick={searchHotels}
            className="rounded-0 w-100 "
            style={{
              backgroundColor: "#0070c1",
              marginTop: "1.5rem",
              marginBottom: "0.25rem",
            }}
          >
            Search
          </Button>
        </Form>
      </div>
      <div style={{ width: "72.5%" }}>
        {hotels.length === 0 && <h3>Found no hotels.</h3>}
        {hotels.length > 0 &&
          hotels.map((hotel) => (
            <div
              key={hotel._id}
              style={{ padding: "0.8rem", marginBottom: "1rem" }}
              className="rounded-3 border border-secondary d-xxl-flex justify-content-between"
            >
              <img
                className={styles.img}
                src={hotel.photos[0]}
                alt={hotel.name}
              />
              <div className={styles.info}>
                <div className="d-flex justify-content-between">
                  <h3 style={{ color: "#0070c1", fontWeight: "bold" }}>
                    {hotel.name}
                  </h3>
                  <p
                    className="py-1 px-2"
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#00387f",
                      color: "white",
                    }}
                  >
                    {hotel.rating}.0
                  </p>
                </div>
                <p>{`${hotel.distance}m from center`}</p>
                <p style={{ fontWeight: "bold" }}>{hotel.desc}</p>
                <div className="d-flex flex-column align-items-end">
                  <p style={{ fontSize: "2rem" }}>${hotel.cheapestPrice}</p>
                  <p
                    style={{
                      color: "#505055",
                      marginTop: "-0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Includes taxes and fees
                  </p>
                  <Button
                    onClick={() => seeDetail(hotel._id)}
                    style={{ fontWeight: "bold", backgroundColor: "#0070c1" }}
                  >
                    See availability
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default Search;
