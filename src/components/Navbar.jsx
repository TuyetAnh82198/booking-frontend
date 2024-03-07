import { Container, Button } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import {
  HouseAddFill,
  AirplaneFill,
  TaxiFrontFill,
  Stars,
  CarFrontFill,
} from "react-bootstrap-icons";
import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateEmail } from "../store";

import styles from "./navbar.module.css";

const Navbar = () => {
  //state email của người dùng đang đăng nhập
  const email = useSelector((state) => state.login.email);

  const dispatch = useDispatch();
  //Hàm kiểm tra người dùng đã đăng nhập chưa
  const checkLogin = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.email) {
          dispatch(updateEmail(data.email));
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => checkLogin(), [checkLogin]);

  const navigate = useNavigate();
  //Hàm chuyển hướng đến trang đăng nhập
  const toLoginPage = () => {
    navigate("/login");
  };

  //Hàm xử lý việc đăng xuất
  const logout = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "You are logged out.") {
          alert("You are logged out.");
          navigate("/login");
          dispatch(updateEmail(""));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ backgroundColor: "#00387f" }}>
      <Container>
        <div className="d-flex justify-content-between p-2">
          <h5
            style={{ color: "white", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Booking Website
          </h5>
          <div className="d-flex">
            {email !== "" && (
              <p className="px-3 my-auto" style={{ color: "white" }}>
                {email}
              </p>
            )}
            <Button
              onClick={() =>
                email === "" ? navigate("/sign-up") : navigate("/transaction")
              }
              className="rounded-0 px-3"
              style={{
                paddingBottom: "0.30rem",
                paddingTop: "0.20rem",
                color: "#00387f",
                backgroundColor: "white",
              }}
            >
              {email === "" ? "Sign Up" : "Transactions"}
            </Button>
            <Button
              onClick={email === "" ? toLoginPage : logout}
              className="rounded-0 px-3"
              style={{
                paddingBottom: "0.30rem",
                paddingTop: "0.20rem",
                color: "#00387f",
                backgroundColor: "white",
                marginLeft: "1.5rem",
              }}
            >
              {email === "" ? "Login" : "Logout"}
            </Button>
          </div>
        </div>
        <nav
          className="col-12"
          style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLinkNotActive
            }
          >
            <HouseAddFill className={styles.icon} />
            Stays
          </NavLink>
          <NavLink
            to="/flights"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLinkNotActive
            }
          >
            <AirplaneFill className={styles.icon} />
            Flights
          </NavLink>
          <NavLink
            to="/car"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLinkNotActive
            }
          >
            <CarFrontFill className={styles.icon} />
            Car rentals
          </NavLink>
          <NavLink
            to="/attractions"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLinkNotActive
            }
          >
            <Stars className={styles.icon} />
            Attractions
          </NavLink>
          <NavLink
            to="/taxis"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLinkNotActive
            }
          >
            <TaxiFrontFill className={styles.icon} />
            Airport taxis
          </NavLink>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;
