import Api from "../api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, Card, Col, Container, FormLabel, Row, Form, Button, Spinner } from "react-bootstrap";

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
      <Container>
        <Row className="justify-content-center">
          <Col md={4} className="mt-150">
            <div className="text-center mb-4">
              <h4>
                <strong>Project Management</strong>
              </h4>
            </div>
            <Card className="border-0 rounded shadow-sm">
              <Card.Body>
                <div className="text-center">
                  <h6 className="fw-bold">Login Admin</h6>
                </div>
                {validation.message && <Alert variant="danger">{validation.message}</Alert>}

                <Form onSubmit={loginHandler}>
                  <Form.Group className="mb-3">
                    <FormLabel>Username</FormLabel>
                    <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </Form.Group>
                  {validation.username && <Alert variant="danger">{validation.username[0]}</Alert>}

                  <Form.Group className="mb-3">
                    <FormLabel>Password</FormLabel>
                    <Form.Control type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                  </Form.Group>
                  {validation.password && <Alert variant="danger">{validation.password[0]}</Alert>}

                  <Button type="submit" id="btn-login" className="fw-bold shadow-sm rounded-sm w-100 py-3" style={{ background: "#00b4d8", color: "white" }}>
                    {isLoading ? (
                      <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden">..loading</span>
                      </Spinner>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
