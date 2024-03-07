import { Container, Button, Form, Col, Row } from "react-bootstrap";
import { CursorFill, CalendarWeek, PersonFill } from "react-bootstrap-icons";
import { DateRangePicker } from "react-date-range";
import { useState, useReducer } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import styles from "./header.module.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const Header = () => {
  //state ẩn, hiện DateRangePicker
  const [hideDateRangePicker, setHideDateRangePicker] = useState(true);
  //state ẩn, hiện form lựa chọn số lượng người lớn, trẻ em, phòng
  const [hideRoomOption, setHideRoomOption] = useState(true);
  //state lựa chọn ngày bắt đầu và ngày kết thúc
  const [datePicked, setDatePicked] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  //state hiển thị ngày tháng đã chọn
  const [renderDate, setRenderDate] = useState({
    startDate: format(new Date(), "MM/dd/yyyy"),
    endDate: format(new Date(), "MM/dd/yyyy"),
  });
  //state tên thành phố đã nhập để tìm khách sạn
  const [destination, setDestination] = useState("");

  //state ban đầu hiển thị số lượng người lớn, trẻ em, phòng đã chọn
  const roomOptionInitial = {
    adult: 1,
    children: 0,
    room: 1,
  };
  //hàm reducer tăng, giảm số lượng người lớn, trẻ em, phòng
  const reducer = (state, action) => {
    if (action.type === "desc") {
      if (action.optionType === "adult") {
        return { ...state, adult: state.adult <= 1 ? 1 : state.adult - 1 };
      } else if (action.optionType === "children") {
        return {
          ...state,
          children: state.children <= 0 ? 0 : state.children - 1,
        };
      }
      if (action.optionType === "room") {
        return { ...state, room: state.room <= 1 ? 1 : state.room - 1 };
      }
    } else if (action.type === "inc") {
      if (action.optionType === "adult") {
        return { ...state, adult: state.adult + 1 };
      } else if (action.optionType === "children") {
        return { ...state, children: state.children + 1 };
      } else if (action.optionType === "room") {
        return { ...state, room: state.room + 1 };
      }
    } else if (action.type === "input") {
      if (action.optionType === "adult") {
        return {
          ...state,
          adult: action.inputValue < 1 ? 1 : action.inputValue,
        };
      } else if (action.optionType === "children") {
        return {
          ...state,
          children: action.inputValue < 0 ? 0 : action.inputValue,
        };
      } else if (action.optionType === "room") {
        return {
          ...state,
          room: action.inputValue < 1 ? 1 : action.inputValue,
        };
      }
    }
  };
  const [roomOption, dispatch] = useReducer(reducer, roomOptionInitial);
  // console.log(roomOption);

  //Hàm chọn ngày tháng
  const pickDate = (ranges) => {
    // console.log(format(ranges.selection.startDate, "yyyy-MM-dd"));
    setDatePicked([
      {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
        key: "selection",
      },
    ]);
    setRenderDate({
      startDate: format(ranges.selection.startDate, "MM/dd/yyyy"),
      endDate: format(ranges.selection.endDate, "MM/dd/yyyy"),
    });
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#00387f",
        color: "white",
      }}
    >
      <Container>
        <h1>A lifetime of discounts? It's Genius.</h1>
        <p className="my-4">
          Get rewarded for your travels - unlock instant savings of 10% or more
          with a free account
        </p>
        <Button
          onClick={() => navigate("/login")}
          className="rounded-0 px-3 py-2 border-0"
          style={{ backgroundColor: "#0070c1" }}
        >
          Sign in / Register
        </Button>
      </Container>
      <Container style={{ marginTop: "3rem" }}>
        <Form
          className="py-2 px-5 rounded-2"
          style={{
            position: "relative",
            top: "2rem",
            backgroundColor: "white",
            border: "solid 0.25rem #feba0c",
          }}
        >
          <Form.Group as={Row}>
            <Col className="d-flex col-lg-3">
              <CursorFill size={20} className={styles.icon} />
              <Form.Control
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border-0"
                type="text"
                placeholder="Where are you going?"
              />
            </Col>
            <Col className="col-lg-4">
              <div
                onClick={() => {
                  setHideDateRangePicker(!hideDateRangePicker);
                }}
                className="d-flex offset-1"
              >
                <CalendarWeek size={20} className={styles.icon} />
                <Form.Control
                  value={`${renderDate.startDate} to ${renderDate.endDate}`}
                  onChange={(e) => {
                    setRenderDate({
                      startDate: e.target.value.split(" ")[0],
                      endDate: e.target.value.split(" ")[2],
                    });
                  }}
                  className="border-0"
                  type="text"
                  // placeholder="06/24/2022 to 06/24/2022"
                />
              </div>
              {!hideDateRangePicker && (
                <div className={styles.datePicker}>
                  <DateRangePicker
                    minDate={new Date()}
                    ranges={datePicked}
                    onChange={pickDate}
                  />
                </div>
              )}
            </Col>
            <Col className="col-lg-4">
              <div
                onClick={() => setHideRoomOption(!hideRoomOption)}
                className="d-flex offset-1"
              >
                <PersonFill size={20} className={styles.icon} />
                <Form.Control
                  value={`${
                    roomOption.adult > 1
                      ? `${roomOption.adult} adults`
                      : `1 adult`
                  }, ${
                    roomOption.children > 1
                      ? `${roomOption.children} children`
                      : `${roomOption.children} child`
                  }, ${
                    roomOption.room > 1 ? `${roomOption.room} rooms` : `1 room`
                  }`}
                  className="border-0"
                  type="text"
                  placeholder="1 adult, 0 child, 1 room"
                />
              </div>
              {!hideRoomOption && (
                <div className={styles.roomOption}>
                  <Form.Group as={Row}>
                    <Col className="col-3">
                      <Form.Label htmlFor="adult">Adult</Form.Label>
                    </Col>
                    <Col className="d-flex justify-content-between">
                      <Button
                        className={styles.selectNumberBtn}
                        onClick={() => {
                          dispatch({ type: "desc", optionType: "adult" });
                          // console.log(roomOption);
                        }}
                      >
                        -
                      </Button>
                      <Form.Control
                        value={roomOption.adult}
                        onChange={(e) => {
                          dispatch({
                            type: "input",
                            optionType: "adult",
                            inputValue: e.target.value,
                          });
                        }}
                        className="offset-1"
                        style={{ width: "4.5rem" }}
                        id="adult"
                        type="number"
                        placeholder="1"
                      />
                      <Button
                        className={`offset-1 ${styles.selectNumberBtn}`}
                        onClick={() => {
                          dispatch({ type: "inc", optionType: "adult" });
                          // console.log(roomOption);
                        }}
                      >
                        +
                      </Button>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="my-1">
                    <Col className="col-3">
                      <Form.Label htmlFor="children">Children</Form.Label>
                    </Col>
                    <Col className="d-flex justify-content-between">
                      <Button
                        className={styles.selectNumberBtn}
                        onClick={() =>
                          dispatch({ type: "desc", optionType: "children" })
                        }
                      >
                        -
                      </Button>
                      <Form.Control
                        value={roomOption.children}
                        onChange={(e) => {
                          dispatch({
                            type: "input",
                            optionType: "children",
                            inputValue: e.target.value,
                          });
                        }}
                        className="offset-1"
                        style={{ width: "4.5rem" }}
                        id="children"
                        type="number"
                        placeholder="1"
                      />
                      <Button
                        className={`offset-1 ${styles.selectNumberBtn}`}
                        onClick={() =>
                          dispatch({ type: "inc", optionType: "children" })
                        }
                      >
                        +
                      </Button>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col className="col-3">
                      <Form.Label htmlFor="room">Room</Form.Label>
                    </Col>
                    <Col className="d-flex justify-content-between">
                      <Button
                        className={styles.selectNumberBtn}
                        onClick={() =>
                          dispatch({ type: "desc", optionType: "room" })
                        }
                      >
                        -
                      </Button>
                      <Form.Control
                        value={roomOption.room}
                        onChange={(e) => {
                          dispatch({
                            type: "input",
                            optionType: "room",
                            inputValue: e.target.value,
                          });
                        }}
                        className="offset-1"
                        style={{ width: "4.5rem" }}
                        id="room"
                        type="number"
                        placeholder="1"
                      />
                      <Button
                        className={`offset-1 ${styles.selectNumberBtn}`}
                        onClick={() =>
                          dispatch({ type: "inc", optionType: "room" })
                        }
                      >
                        +
                      </Button>
                    </Col>
                  </Form.Group>
                </div>
              )}
            </Col>
            <Col className="col-lg-1" style={{ textAlign: "right" }}>
              <Button
                className="rounded-0"
                onClick={() => {
                  if (destination.trim().length === 0) {
                    alert("The destination cannot be empty!");
                  } else {
                    navigate("/search", {
                      state: {
                        destination,
                        datePicked,
                        roomOption,
                      },
                    });
                  }
                }}
              >
                Search
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
};

export default Header;
