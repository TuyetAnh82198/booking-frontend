import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { updateEmail } from "../store";

const LogIn = () => {
  const emailInput = useRef();
  const passInput = useRef();

  const navigate = useNavigate();
  //Hàm kiểm tra người dùng đã đăng nhập chưa
  const checkLogin = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.email);
        if (data.email) {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => checkLogin(), [checkLogin]);

  const dispatch = useDispatch();
  //Hàm xử lý việc đăng nhập
  const login = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.current.value,
        pass: passInput.current.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.errs) {
            alert(data.errs);
          } else if (data.message === "Wrong email or password.") {
            alert("Wrong email or password.");
          } else if (data.message === "You are logged in.") {
            alert("You are logged in.");
            navigate("/");
            dispatch(updateEmail(emailInput.current.value));
          }
        } else {
          navigate(`/server-error`);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container
      className="col-4"
      style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
    >
      <Form style={{ textAlign: "center" }}>
        <h1 className="py-4" style={{ fontWeight: "bold" }}>
          Login
        </h1>
        <Form.Control
          className="py-3 rounded-1"
          type="text"
          placeholder="Email"
          ref={emailInput}
        />
        <Form.Control
          className="py-3 rounded-1 my-3"
          type="password"
          placeholder="Password"
          ref={passInput}
        />
        <Button
          onClick={login}
          className="w-100 py-3 border-0"
          style={{ fontWeight: "bold", backgroundColor: "#0070c1" }}
        >
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LogIn;
