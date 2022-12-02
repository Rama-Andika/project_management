import Api from "../api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, Card, Col, Container, FormLabel, Row, Form, Button, Spinner } from "react-bootstrap";
import imgLogin from "../assets/images/login.jpg";

const Login = () => {
  document.title = "Login - Project Management";

  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");

  const [isLoading, setisLoading] = useState(false);

  const [validation, setvalidation] = useState({});

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    setisLoading(true);

    await Api.post("/api/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        setisLoading(false);

        toast.success("Login Berhasil!", {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        Cookies.set("token", response.data.token);
        navigate("/project");
      })
      .catch((error) => {
        setisLoading(false);

        setvalidation(error.response.data);
      });
  };

  // if (email != "admin@admin.com") {
  //   return <Navigate to="/" />;
  // }

  return (
    <>
      <Row className="g-0">
        <Col md={8} className="imgLogin">
          <img className="" src={imgLogin} style={{ height: "100vh", width: "100%", objectFit: "cover" }} alt="imgLogin" />
        </Col>
        <Col md={4} className="login-form">
          <Card className="border-0 login-card">
            <div className="mt-5">
              <div className="text-center">
                <h5 className="fw-bold">Project Management</h5>
              </div>
              {validation.message && <Alert variant="danger" className="mt-3 text-center">{validation.message}</Alert>}

              <Form onSubmit={loginHandler} className="form-login pt-3">
                <Form.Group className="mb-3">
                  <FormLabel>Username</FormLabel>
                  <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                {validation.username && <Alert variant="danger">{validation.username[0]}</Alert>}

                <Form.Group className="mb-4 pt-3">
                  <FormLabel>Password</FormLabel>
                  <Form.Control type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                </Form.Group>
                {validation.password && <Alert variant="danger">{validation.password[0]}</Alert>}

                <Button type="submit" id="btn-login" className="fw-bold shadow-sm rounded-sm w-100 py-3 mt-5" style={{ background: "#00b4d8", color: "white" }}>
                  {isLoading ? (
                    <Spinner animation="border" size="sm" role="status">
                      <span className="visually-hidden">..loading</span>
                    </Spinner>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Login;
