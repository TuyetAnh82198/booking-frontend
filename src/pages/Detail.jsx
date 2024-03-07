//Hiển thị thông tin cụ thể của một khách sạn
import { GeoAltFill } from "react-bootstrap-icons";
import { Container, Button, Carousel, Image, Form, Col } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useCallback, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { intervalToDuration, format } from "date-fns";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const Detail = () => {
  const location = useLocation();

  const [hotel, setHotel] = useState(location.state);

  const params = useParams();
  //Nếu người dùng truy cập trang này bằng url thay vì được chuyển hướng từ trang khác
  const fetchDetail = useCallback(() => {
    if (!hotel) {
      fetch(`${process.env.REACT_APP_BACKEND}/hotels/detail/${params.id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setHotel(data.result);
        })
        .catch((err) => console.log(err));
    }
  }, []);
  useEffect(() => fetchDetail(), [fetchDetail]);

  //state ẩn, hiện form đặt phòng
  const [hideForm, setHideForm] = useState(true);
  //state thông tin các phòng khả dụng
  const [rooms, setRooms] = useState([]);
  //state danh sách số phòng đã chọn
  const [pickedRoom, setPickedRoom] = useState([]);
  //state lựa chọn ngày bắt đầu và ngày kết thúc
  const [datePicked, setDatePicked] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  //state tổng tiền (số ngày * giá phòng)
  const [totalBill, setTotalBill] = useState(0);
  //state checkbox chọn phòng
  const [checkbox, setCheckbox] = useState([]);
  //state phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("Select Payment Method");
  //state email người đặt phòng
  const [email, setEmail] = useState("");

  const nameInput = useRef();
  const phoneInput = useRef();
  const cardIdInput = useRef();

  const navigate = useNavigate();
  //hàm hiển thị những phòng còn trống
  const fetchEmptyRooms = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/transactions/check`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId: hotel._id,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.message === "have not been logged in yet") {
            navigate("/login");
          } else if (data.result) {
            setRooms(data.result);
            const checkboxArr = [];
            data.result.forEach((room) =>
              checkboxArr.push(new Array(room.roomNumbers.length).fill(false))
            );
            setCheckbox(checkboxArr);
          } else {
            navigate(`/server-error`);
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchEmptyRooms(), []);

  //Hàm chọn ngày tháng, và cập nhật danh sách phòng còn trống dựa trên ngày tháng đó
  const pickDate = (ranges) => {
    // console.log(format(ranges.selection.startDate, "MM/dd/yyyy"));
    setDatePicked([
      {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
        key: "selection",
      },
    ]);
    fetch(`${process.env.REACT_APP_BACKEND}/transactions/check`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId: hotel._id,
        startDate: format(ranges.selection.startDate, "yyyy-MM-dd"),
        endDate: format(ranges.selection.endDate, "yyyy-MM-dd"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.message === "have not been logged in yet") {
            navigate("/login");
          } else if (data.result) {
            setRooms(data.result);
            const checkboxArr = [];
            data.result.forEach((room) =>
              checkboxArr.push(new Array(room.roomNumbers.length).fill(false))
            );
            setCheckbox(checkboxArr);
          } else {
            navigate(`/server-error`);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  //Hàm ẩn, hiện form đặt phòng,
  //và lấy thông tin những phòng khả dụng để hiển thị cho người dùng lựa chọn
  const formHandler = (hotelId) => {
    fetch(`${process.env.REACT_APP_BACKEND}/hotels/booking-form/${hotelId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "have not been logged in yet") {
          navigate("/user/login", {
            state: { prevUrl: `/detail/${hotelId}`, payload: hotel },
          });
        } else if (data.result) {
          setTotalBill(0);
          setHideForm(!hideForm);
          // setRooms(data.result);
          // const checkboxArr = [];
          // data.result.forEach((room) =>
          //   checkboxArr.push(new Array(room.roomNumbers.length).fill(false))
          // );
          // setCheckbox(checkboxArr);
          setEmail(data.email);
        }
      })
      .catch((err) => console.log(err));
  };

  //Hàm tính totalBill
  const totalBillHandler = (
    id,
    price,
    roomNumber,
    outsideArrIndex,
    insideArrIndex
  ) => {
    checkbox[outsideArrIndex][insideArrIndex] =
      !checkbox[outsideArrIndex][insideArrIndex];
    setCheckbox(checkbox);
    if (pickedRoom.length === 0) {
      setPickedRoom([
        {
          roomId: id,
          roomNumber: roomNumber,
        },
      ]);
      setTotalBill(
        price *
          (intervalToDuration({
            start: datePicked[0].startDate,
            end: datePicked[0].endDate,
          }).days +
            1)
      );
    } else {
      let isAdded = false;
      for (let i = 0; i < pickedRoom.length; i++) {
        if (pickedRoom[i].roomNumber === roomNumber) {
          isAdded = true;
        }
      }

      if (!isAdded) {
        const arr = [...pickedRoom];
        arr.push({ roomId: id, roomNumber: roomNumber });
        setPickedRoom(arr);
        setTotalBill((prevState) => {
          return (
            prevState +
            price *
              (intervalToDuration({
                start: datePicked[0].startDate,
                end: datePicked[0].endDate,
              }).days +
                1)
          );
        });
      } else {
        const arr = [...pickedRoom];
        const index = arr.findIndex((number) => number === roomNumber);
        arr.splice(index, 1);
        setPickedRoom(arr);
        setTotalBill((prevState) => {
          return (
            prevState -
            price *
              (intervalToDuration({
                start: datePicked[0].startDate,
                end: datePicked[0].endDate,
              }).days +
                1)
          );
        });
      }
    }
  };

  //Hàm xử lý việc đặt phòng
  const reserveNow = () => {
    if (
      nameInput.current.value.trim().length === 0 ||
      email.trim().length === 0
    ) {
      alert("Please fill in the form.");
    } else if (pickedRoom.length === 0 || totalBill === 0) {
      alert("Please select rooms.");
    } else if (paymentMethod === "Select Payment Method") {
      alert("Please select payment method.");
    } else {
      fetch(`${process.env.REACT_APP_BACKEND}/hotels/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user: nameInput.current.value,
          email: email,
          hotel: hotel._id,
          room: pickedRoom,
          startDate: format(datePicked[0].startDate, "yyyy-MM-dd"),
          endDate: format(datePicked[0].endDate, "yyyy-MM-dd"),
          price: totalBill,
          payment: paymentMethod,
          status: "Booked",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Booking successful!") {
            alert("Booking successful!");
            navigate("/transaction");
          }
        })
        .catch((err) => console.log(err));
    }
    console.log(datePicked[0].startDate);
  };

  return (
    <Container className="my-2">
      {hotel && (
        <div>
          <h3 style={{ fontWeight: "bold" }}>{hotel.name}</h3>
          <div className="d-flex" style={{ marginTop: "1rem" }}>
            <GeoAltFill size={16} style={{ marginRight: "0.4rem" }} />
            <p>{hotel.address}</p>
          </div>
          <p style={{ color: "#0070c1", fontWeight: "500" }}>
            {hotel.distance}m from center
          </p>
          <Container className="d-flex justify-content-around">
            <Carousel slide={false}>
              {hotel.photos.map((photo, i) => (
                <Carousel.Item key={(Math.random() * 10).toString()}>
                  <Image
                    height="400"
                    src={photo}
                    alt={`hotel's photo ${i + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
          <div
            className="d-flex justify-content-between"
            style={{ marginTop: "4rem" }}
          >
            <div className="col-8">
              <h3 style={{ fontWeight: "bold" }}>{hotel.name}</h3>
              <p>{hotel.desc}</p>
            </div>
            <div className="col-3 p-3" style={{ backgroundColor: "#eaf3ff" }}>
              <h3 className="my-3" style={{ fontWeight: "bold" }}>
                ${hotel.cheapestPrice}{" "}
                <span style={{ fontWeight: "400" }}>(1 nights)</span>
              </h3>
              <Button
                onClick={() => formHandler(hotel._id)}
                className="w-100"
                style={{ fontWeight: "bold", backgroundColor: "#0070c1" }}
              >
                Reserve or Book Now!
              </Button>
            </div>
          </div>
        </div>
      )}
      {!hideForm && (
        <div>
          <div className="d-flex justify-content-between">
            <div className="col-6 col-md-5 col-lg-4 col-xl-3">
              <h5 style={{ fontWeight: "bold" }}>Dates</h5>
              <DateRangePicker
                minDate={new Date()}
                ranges={datePicked}
                onChange={pickDate}
              />
            </div>
            <div
              className="col-6 col-md-7 col-lg-8 col-xl-9"
              style={{ paddingLeft: "5rem" }}
            >
              <h5 style={{ fontWeight: "bold" }}>Reserve Info</h5>
              <Form>
                <Form.Group className="my-2">
                  <Form.Label className="my-1" htmlFor="name">
                    Your Full Name:
                  </Form.Label>
                  <Form.Control
                    ref={nameInput}
                    id="name"
                    type="text"
                    placeholder="Full Name"
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Label className="my-1" htmlFor="email">
                    Your Email:
                  </Form.Label>
                  <Form.Control
                    className="my-1"
                    id="email"
                    type="text"
                    placeholder="Email"
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Label className="my-1" htmlFor="phone">
                    Your Phone Number:
                  </Form.Label>
                  <Form.Control
                    ref={phoneInput}
                    id="phone"
                    type="number"
                    placeholder="Phone Number"
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Label className="my-1" htmlFor="idCard">
                    Your Identity Card Number:
                  </Form.Label>
                  <Form.Control
                    ref={cardIdInput}
                    id="idCard"
                    type="text"
                    placeholder="Card Number"
                  />
                </Form.Group>
              </Form>
            </div>
          </div>
          <div>
            <h5 className="my-4" style={{ fontWeight: "bold" }}>
              Select Rooms
            </h5>
            <div className="d-flex">
              {rooms.length === 0 && <p>Hotel has no available room.</p>}
              {rooms.length > 0 &&
                rooms.map((room, outsideArrIndex) => (
                  <div key={room._id} className="d-flex col-6">
                    <div className="col-6">
                      <h5 className="my-0">{room.title}</h5>
                      <p className="my-0">{room.desc}</p>
                      <p
                        className="my-0"
                        style={{ fontSize: "0.9rem", fontWeight: "500" }}
                      >
                        Max people:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {room.maxPeople}
                        </span>
                      </p>
                      <h5>${room.price}</h5>
                    </div>
                    <div className="d-flex align-items-center col-6">
                      {room.roomNumbers.length === 0 && <p>Rooms is full.</p>}
                      {room.roomNumbers.map((roomNumber, insideArrIndex) => (
                        <Form.Group key={(Math.random() * 10).toString()}>
                          <Col
                            style={{
                              marginLeft: "0.5rem",
                              textAlign: "center",
                            }}
                          >
                            <Form.Label
                              style={{ color: "gray", cursor: "pointer" }}
                              htmlFor={roomNumber}
                            >
                              {roomNumber}
                            </Form.Label>
                            <Form.Check
                              onChange={() => {
                                totalBillHandler(
                                  room._id,
                                  room.price,
                                  roomNumber,
                                  outsideArrIndex,
                                  insideArrIndex
                                );
                              }}
                              value={roomNumber}
                              id={roomNumber}
                              checked={
                                checkbox.length === 0
                                  ? false
                                  : checkbox[outsideArrIndex][insideArrIndex]
                              }
                            />
                          </Col>
                        </Form.Group>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h5 style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Total Bill: ${totalBill}
            </h5>
            <Form className="d-flex">
              <div className="col-3">
                <Form.Select
                  style={{ marginBottom: "2rem", backgroundColor: "#eeeeee" }}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                  }}
                >
                  <option value={paymentMethod}>{paymentMethod}</option>
                  {["Credit Card", "Cash"]
                    .filter((method) => method !== paymentMethod)
                    .sort()
                    .map((method) => (
                      <option
                        key={(Math.random() * 10).toString()}
                        value={method}
                      >
                        {method}
                      </option>
                    ))}
                </Form.Select>
              </div>
              <div>
                <Button
                  onClick={reserveNow}
                  className="mx-5 px-5"
                  style={{
                    backgroundColor: "#0070c1",
                    fontWeight: "bold",
                  }}
                >
                  Reserve Now
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Detail;
