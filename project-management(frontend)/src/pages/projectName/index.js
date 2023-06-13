//import react

import React, { useState, useEffect } from "react";

//import layout admin

import LayoutAdmin from "../../layouts/Admin";

//import BASE URL API
import Api from "../../api";

//import js cookie

import Cookies from "js-cookie";
import PaginationComponent from "../../components/Pagination";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { Button, Card, Col, Row, Table, Form, Modal, Alert } from "react-bootstrap";
import Search from "../../components/Search";
import Loading from "../../components/Loading";
import Addbutton from "../../components/Addbutton";
import EditAction from "../../components/EditAction";
import DeleteAction from "../../components/DeleteAction";

function ProjectNameIndex() {
  document.title = "Project Name";

  const [projectNames, setProjectNames] = useState([]);

  // const [sortType, setSortType] = useState("desc");

  const [edit, setEdit] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const [perPage, setPerPage] = useState(0);

  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [sequence, setSequence] = useState("");
  const [requiredFile, setRequiredFile] = useState("0");

  const [validation, setValidation] = useState({});

  const [loading, setLoading] = useState(false);

  const [blur, setBlur] = useState(0);

  const [q, setQ] = useState("");

  const token = Cookies.get("token");

  const fetchData = async (pageNumber, searchData) => {
    const page = pageNumber ? pageNumber : currentPage;
    const searchQuery = searchData ? searchData : q;

    setLoading(true);

    await Api.get(`/api/projectName?page=${page}&q=${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjectNames(response.data.data.data);

      setCurrentPage(response.data.data.current_page);

      setPerPage(response.data.data.per_page);

      setTotal(response.data.data.total);

      setLoading(false);
    });
  };

  // const sortedData = (projectNames) => {
  //   let result;

  //   if (sortType === "desc") {
  //     result = [...projectNames].sort((a, b) => {
  //       return b.sequence.toString().localeCompare(a.sequence.toString(), "en", {
  //         numeric: true,
  //       });
  //     });
  //   } else if (sortType === "asc") {
  //     result = [...projectNames].sort((a, b) => {
  //       return a.sequence.toString().localeCompare(b.sequence.toString(), "en", {
  //         numeric: true,
  //       });
  //     });
  //   } else {
  //     return projectNames;
  //   }

  //   setProjectNames(result);
  // };

  //hook

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // and on sortType change you can handle it like this:
  // useEffect(() => {
  //   sortedData(projectNames);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sortType]);

  const handleShowModal = () => {
    setShowModal(true);
    setBlur(5);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setValidation({});
    setName("");
    setSequence("");
    setRequiredFile("0");
    setEdit({});
    setBlur(0);
  };

  const deleteProjectName = (id) => {
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
                        await Api.delete(`/api/projectName/${id}`, {
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
                          .catch((onClose) => {
                            toast.error("Delete data failed", {
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

  const storeProjectName = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData();

    if (edit.id) {
      formData.append("name", name);
      formData.append("required_file", requiredFile);
      formData.append("_method", "PATCH");

      await Api.post(`/api/projectName/${edit.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Update Project Name succefully", {
            duration: 4000,
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });

          setLoading(false);
          fetchData();
          handleCloseModal();
        })
        .catch((error) => {
          setLoading(false);
          setValidation(error.response.data);
        });
    } else {
      formData.append("name", name);
      formData.append("sequence", sequence);
      formData.append("required_file", requiredFile);

      await Api.post("/api/projectName", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Saved categorry succesffuly", {
            duration: 4000,
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setLoading(false);
          fetchData();
          handleCloseModal();
        })
        .catch((error) => {
          setLoading(false);
          setValidation(error.response.data);
        });
    }
  };

  const editHandler = (projectName) => {
    setEdit(projectName);
    setName(projectName.name);
    setSequence(projectName.sequence);
    setRequiredFile(projectName.required_file);
    handleShowModal();
  };

  const searchHandler = (e) => {
    e.preventDefault();

    fetchData(1, q);
  };

  return (
    <React.Fragment>
      <LayoutAdmin blur={blur}>
        <Row className=" mt-4" style={{ filter: `blur(${blur}px)` }}>
          <Col xs={12}>
            <Card className=" border-0 rounded shadow-sm">
              <Card.Header>
                <span className="fw-bold">PROJECT NAME</span>
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <Search onSubmit={searchHandler} value={q} onChange={(e) => setQ(e.target.value)} name="name" />
                  </Col>
                  <Col xs={2}>
                    <Addbutton size="md" onClick={handleShowModal} display="none" />
                  </Col>
                </Row>
                <Table className="table" responsive bordered hover>
                  <thead style={{ backgroundColor: "#569cb8" }} className="text-white">
                    <tr>
                      <th className="text-nowrap">Name</th>
                      <th className="text-nowrap">Sequence</th>
                      <th className="text-nowrap">Required File</th>
                      <th className="text-nowrap">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <Loading size="lg" />
                        </td>
                      </tr>
                    ) : !projectNames.length > 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          Data Not Found
                        </td>
                      </tr>
                    ) : (
                      projectNames.map((data) => {
                        return (
                          <tr key={data.id}>
                            <td>{data.name}</td>
                            <td>{data.sequence}</td>
                            <td>{data.required_file === "0" ? "No" : "Yes"}</td>
                            <td>
                              <EditAction onEdit={() => editHandler(data)} />
                              <DeleteAction
                                onDelete={() => {
                                  deleteProjectName(data.id);
                                }}
                                display="none"
                              />
                            </td>
                          </tr>
                        );
                      })
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
            <Modal.Title>{edit.id ? "Edit Project" : "Create Project"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={storeProjectName}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              {validation.name && <Alert variant="danger">{validation.name}</Alert>}

              {!edit.id && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Sequence</Form.Label>
                    <Form.Control type="text" value={sequence} onChange={(e) => setSequence(e.target.value)} />
                  </Form.Group>
                  {validation.sequence && (
                    <Alert variant="danger" className="mb-3">
                      {validation.sequence}
                    </Alert>
                  )}
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Required File</Form.Label>
                <br />

                <Form.Check name="requiredFile" inline type="radio" label="no" value="0" onChange={(e) => setRequiredFile(e.target.value)} checked={requiredFile === "0" && true} />
                <Form.Check name="requiredFile" inline type="radio" label="yes" value="1" onChange={(e) => setRequiredFile(e.target.value)} checked={requiredFile === "1" && true} />
              </Form.Group>
              {validation.required_file && (
                <Alert variant="danger" className="mb-3">
                  {validation.required_file}
                </Alert>
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
    </React.Fragment>
  );
}

export default ProjectNameIndex;
