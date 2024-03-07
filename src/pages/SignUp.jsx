import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { useState } from "react";
import generator from "generate-password-browser";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  //state email đã nhập
  const [email, setEmail] = useState("");
  //state mật khẩu đã nhập
  const [pass, setPass] = useState("");
  //state mật khẩu tự động
  const [randomPass, setRandomPass] = useState("");

  //Hàm tạo mật khẩu tự động
  const generateRandomPass = () => {
    const generatedPass = generator.generate({
      length: 8,
      numbers: true,
    });
    setRandomPass(generatedPass);
  };

  const navigate = useNavigate();
  //Hàm xử lý việc đăng ký
  const signUp = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        pass: pass,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.errs) {
            alert(data.errs);
          } else if (data.message === "Created!") {
            alert("Created!");
            navigate("/login");
          } else if (data.message === "Existing user.") {
            alert("Existing user.");
          }
        } else {
          navigate(`/server-error`);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container
      className="col-10 col-sm-7 col-md-6 col-lg-5 col-xxl-4"
      style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
    >
      <Form style={{ textAlign: "center" }}>
        <h1 className="py-4" style={{ fontWeight: "bold" }}>
          Sign Up
        </h1>
        <Form.Control
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-3 rounded-1"
          type="text"
          placeholder="Email"
          name="email"
        />
        <Form.Control
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="py-3 rounded-1 my-3"
          type="password"
          placeholder="Password"
          name="pass"
        />
        <InputGroup style={{ marginBottom: "1rem" }}>
          <Form.Control
            className="py-3 rounded-1"
            value={randomPass}
            placeholder="Or get random pass here"
          />
          <Button onClick={generateRandomPass} variant="outline-secondary">
            Random pass
          </Button>
          <Button
            onClick={() => {
              setPass(randomPass);
            }}
            variant="outline-secondary"
            style={{ borderLeft: "none" }}
          >
            Copy
          </Button>
        </InputGroup>
        <Button
          onClick={signUp}
          className="w-100 py-3 border-0"
          style={{ fontWeight: "bold", backgroundColor: "#0070c1" }}
        >
          Sign Up
        </Button>
      </Form>
    </Container>
  );
};

export default SignUp;
