import { Alert, Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import LayoutAdmin from "../../layouts/Admin";
import Api from "../../api";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import PaginationComponent from "../../components/Pagination";
import Search from "../../components/Search";
import Loading from "../../components/Loading";
import Addbutton from "../../components/Addbutton";
import EditAction from "../../components/EditAction";
import DeleteAction from "../../components/DeleteAction";
import TableHead from "../../components/table/TableHead";

const columns = [
  { label: "Name", accessor: "name", sortable: true },
  { label: "Username", accessor: "username", sortable: true },
  { label: "Email", accessor: "email", sortable: false },
  { label: "Actions", accessor: "actions", sortable: false },
];

const UsersIndex = () => {
  document.title = "Users";
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(0);
  const [edit, setEdit] = useState({});
  const [passwordShow, setPasswordShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({});


  const token = Cookies.get("token");

  const fetchData = async (pageNumber, searchData) => {
    const page = pageNumber ? pageNumber : currentPage;
    const searchQuery = searchData ? searchData : q;
    setLoading(true);
    await Api.get(`/api/users?page=${page}&q=${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setUsers(response.data.data.data);
      setCurrentPage(response.data.data.current_page);
      setPerPage(response.data.data.per_page);
      setTotal(response.data.data.total);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
    setEmail("");
    setPassword("");
    setBlur(5);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBlur(0);
    setValidation({});
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setEdit({});
  };

  const storeUsers = async (e) => {
    e.preventDefault();

    setLoading(true);


    const formData = new FormData();

    if (edit.id) {
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);
      formData.append("_method", "PATCH");

      await Api.post(`/api/users/${edit.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Data saved succefully", {
            duration: 4000,
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setLoading(false);
          handleCloseModal();
          fetchData();
        })
        .catch((error) => {
          setValidation(error.response.data);
          setLoading(false);
        });
    } else {
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);

      await Api.post("/api/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Data saved succefully", {
            duration: 4000,
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setLoading(false);
        
          handleCloseModal();
          fetchData();
        })
        .catch((error) => {
          setLoading(false);
          
          setValidation(error.response.data);
        });
    }
  };

  const editHandler = (user) => {
    setEdit(user);
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    handleShowModal();
  };

  const deleteHandler = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <Card style={{ background: "#00b4d8" }}>
              <Card.Body className="text-black">
                <Card.Title>Are you sure?</Card.Title>
                <Card.Text>You want to delete this file?</Card.Text>
                <Row>
                  <Col>
                    <Button onClick={onClose} style={{ background: "#06d6a0" }}>
                      No
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="text-nowrap"
                      variant="danger"
                      onClick={async () => {
                        await Api.delete(`/api/users/${id}`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        })
                          .then((onClose) => {
                            toast.success("Delete data succesfully", {
                              duration: 4000,
                              position: "top-right",
                              style: {
                                borderRadius: "10px",
                                background: "#333",
                                color: "#fff",
                              },
                            });
                            fetchData();
                          })
                          .catch((error) => {
                            toast.error("User is logged in", {
                              duration: 4000,
                              position: "top-right",
                              style: {
                                borderRadius: "10px",
                                background: "#333",
                                color: "#fff",
                              },
                            });
                          });
                        onClose();
                      }}
                    >
                      Yes, Delete it!
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        );
      },
    });
  };

  const searchHandler = (e) => {
    e.preventDefault();

    fetchData(1, q);
  };

  const handleClickChangePassword = () => {
    setPasswordShow(passwordShow ? false : true);
    if (!passwordShow) {
      setPassword("");
      setPasswordConfirmation("");
    }
  };
  return (
    <LayoutAdmin blur={blur}>
      <Row className="mt-4">
        <Col>
          <Card className="border-0 rounded shadow-sm" style={{ filter: `blur(${blur}px)` }}>
            <Card.Header>
              <span className="fw-bold">
                <i className="fa fa-users"></i> USERS
              </span>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={10}>
                  <Search onSubmit={searchHandler} value={q} onChange={(e) => setQ(e.target.value)} name="name, username, or email" />
                </Col>
                <Col xs={2}>
                  <Addbutton size="md" onClick={handleShowModal} />
                </Col>
              </Row>
              <Table responsive bordered hover>
                <TableHead columns={columns} />
                <tbody>
                  {loading ? (
                    <tr className="text-center py-4">
                      <td colSpan={5}>
                        <Loading size="lg" />
                      </td>
                    </tr>
                  ) : !users.length > 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        Data Not Found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <EditAction onEdit={() => editHandler(user)} />
                          <DeleteAction
                            onDelete={() => {
                              deleteHandler(user.id);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
              <Row className="mt-4">
                <Col className="text-nowrap">Total : {total}</Col>
                <Col>
                  <PaginationComponent currentPage={currentPage} perPage={perPage} total={total} onChange={(pageNumber) => fetchData(pageNumber)} position="end" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{edit.id ? "Edit User" : "Create Users"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={storeUsers}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            </Form.Group>
            {validation.name && <Alert variant="danger">{validation.name}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            {validation.username && <Alert variant="danger">{validation.username}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            {validation.email && <Alert variant="danger">{validation.email}</Alert>}
            {!edit.id ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                {validation.password && <Alert variant="danger">{validation.password}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                </Form.Group>
                {validation.password && <Alert variant="danger">{validation.password}</Alert>}
              </>
            ) : (
              <>
                <Button variant="link" className="mb-4" onClick={handleClickChangePassword}>
                  <i>Change Password</i>
                </Button>
                {passwordShow ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    {validation.password && <Alert variant="danger">{validation.password}</Alert>}
                    <Form.Group className="mb-3">
                      <Form.Label>Password Confirmation</Form.Label>
                      <Form.Control type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                    </Form.Group>
                    {validation.password && <Alert variant="danger">{validation.password}</Alert>}
                  </>
                ) : (
                  ""
                )}
              </>
            )}

            {edit.id ? (
              <>
                {loading ? (
                  <Button className="w-100" disabled variant="warning">
                    <Loading size="sm" />
                  </Button>
                ) : (
                  <Button type="submit" className="w-100" variant="warning">
                    Edit
                  </Button>
                )}
              </>
            ) : (
              <>
                {loading ? (
                  <Button style={{ background: "#00b4d8" }} className="w-100" disabled>
                    <Loading size="sm" />
                  </Button>
                ) : (
                  <Button type="submit" style={{ background: "#00b4d8" }} className="w-100">
                    Save
                  </Button>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </LayoutAdmin>
  );
};

export default UsersIndex;
