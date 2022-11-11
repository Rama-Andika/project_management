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
import { Button, Card, Col, InputGroup, Row, Table, Form, Modal, Alert, Spinner } from "react-bootstrap";

function ProjectStatusIndex() {
  //title page

  document.title = "Project Status";

  //state posts

  const [projectStatuses, setProjectStatuses] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [projectNameId, setProjectNameId] = useState("");

  const [edit, setEdit] = useState({});

  //state currentPage

  const [currentPage, setCurrentPage] = useState(1);

  //state perPage

  const [perPage, setPerPage] = useState(0);

  //state total

  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [sequence, setSequence] = useState("");
  const [status, setStatus] = useState("");

  const [validation, setValidation] = useState({});

  const [loading, setLoading] = useState(false);

  const [blur, setBlur] = useState(0);

  const [q, setQ] = useState("");
  const [searchParam] = useState(["status"]);

  //token

  const token = Cookies.get("token");

  //function "fetchData"

  const fetchData = async (pageNumber) => {
    //define variable "searchQuery"

    const page = pageNumber ? pageNumber : currentPage;

    setLoading(true);

    //fetching data from Rest API

    await Api.get(`/api/projectStatus?page=${page}`, {
      headers: {
        //header Bearer + Token

        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data response to state "categories"

      setProjectStatuses(response.data.data.data);

      //set currentPage

      setCurrentPage(response.data.data.current_page);

      //set perPage

      setPerPage(response.data.data.per_page);

      //total

      setTotal(response.data.data.total);

      setLoading(false);
    });
  };

  const fetchProjectName = async () => {
    await Api.get("/api/projectName", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjectNames(response.data.data.data);
    });
  };

  const data = Object.values(projectStatuses);
  const search = (projectStatuses) => {
    return projectStatuses.filter((projectStatus) => {
      return searchParam.some((newProjectStatus) => {
        return projectStatus[newProjectStatus]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
      });
    });
  };

  //hook

  useEffect(() => {
    //call function "fetchData"

    fetchData();
    fetchProjectName();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
    setBlur(5);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setValidation({});
    setName("");
    setSequence("");
    setStatus("");
    setEdit({});
    setBlur(0);
  };

  const deleteCategory = (id) => {
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
                        }).then((onClose) => {
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

  const storeCategory = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData();

    if (edit.id) {
      formData.append("project_name_id", projectNameId);
      formData.append("status", status);
      formData.append("sequence", sequence);

      formData.append("_method", "PATCH");

      await Api.post(`/api/projectStatus/${edit.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Update category succefully", {
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

    formData.append("project_name_id", projectNameId);
    formData.append("status", status);
    formData.append("sequence", sequence);

    await Api.post("/api/projectStatus", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success("Saved Project Status succesffuly", {
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
  };

  const editHandler = (projectStatus) => {
    setEdit(projectStatus);
    setName(projectStatus.project_name_id);
    setSequence(projectStatus.sequence);
    setStatus(projectStatus.status);
    handleShowModal();
  };

  // const handleChangeCheckedAll = (e) => {
  //   setIsCheckedAll(isCheckedAll ? false : true);

  //   if (!isCheckedAll) {
  //     const temp = [...isChecked];
  //     for (let i = 0; i < categories.length; i++) {
  //       temp[i] = true;
  //     }
  //     setCount(temp.length);

  //     setIsChecked(temp);
  //   } else {
  //     const temp = [...isChecked];
  //     for (let i = 0; i < categories.length; i++) {
  //       temp[i] = false;
  //     }
  //     setCount(0);
  //     setIsChecked(temp);
  //   }
  // };

  // const handleChangeChecked = (index) => {
  //   const temp = [...isChecked];
  //   categories.map((c, i) => {
  //     if (i === index) {
  //       temp[i] = isChecked[i] ? false : true;
  //       if (temp[i]) {
  //         setCount(count + 1);
  //       } else {
  //         setCount(count - 1);
  //       }
  //       return setIsChecked(temp);
  //     } else {
  //       temp[i] = isChecked[i] ? true : false;
  //       return setIsChecked(temp);
  //     }
  //   });

  //   setIsChecked(temp);
  // };

  return (
    <React.Fragment>
      <LayoutAdmin>
        <Row className=" mt-4" style={{ filter: `blur(${blur}px)` }}>
          <Col xs={12}>
            <Card className=" border-0 rounded shadow-sm">
              <Card.Header>
                <span className="fw-bold">PROJECT STATUS</span>
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <InputGroup className="mb-3">
                      <Form.Control type="search" name="search-form" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for..." />
                    </InputGroup>
                  </Col>
                  <Col xs={2}>
                    <Button className="rounded-circle float-end" size="md" style={{ background: "#06d6a0" }} onClick={handleShowModal}>
                      <i className="fa-solid fa-plus fa-sm"></i>
                    </Button>
                  </Col>
                </Row>
                <Table responsive bordered striped hover>
                  <thead>
                    <tr>
                      <th>No.</th>

                      <th>Status</th>

                      <th className="text-nowrap">Project Name</th>

                      <th>Sequence</th>

                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <Spinner animation="border" size="lg" role="status" />
                          <span className="visually-hidden">...loading</span>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {search(data) == "" ? (
                          <tr>
                            <td colSpan={4} className="text-center py-4">
                              Data Not Found
                            </td>
                          </tr>
                        ) : (
                          search(data).map((projectStatus, index) => (
                            <tr key={projectStatus.id}>
                              <td>{++index + (currentPage - 1) * perPage}</td>

                              <td>{projectStatus.status}</td>
                              <td>{projectStatus.project_name.name}</td>

                              <td>{projectStatus.sequence}</td>
                              <td>
                                <Button
                                  className="me-3 mb-3"
                                  variant="warning"
                                  onClick={() => {
                                    editHandler(projectStatus);
                                  }}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </Button>

                                <Button
                                  className=" mb-3"
                                  variant="danger"
                                  onClick={() => {
                                    deleteCategory(projectStatus.id);
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </>
                    )}
                  </tbody>
                </Table>
                <Row>
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
            <Modal.Title>{edit.id ? "Edit Category" : "Create Category"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={storeCategory}>
              <Form.Group className="mb-3">
                <Form.Label>Project Name</Form.Label>
                <Form.Select value={projectNameId} onChange={(e) => setProjectNameId(e.target.value)}>
                  <option value="">-- Select project --</option>
                  {projectNames.map((projectName) => (
                    <option key={projectName.id} value={projectName.id}>
                      {projectName.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {validation.project_name_id && <Alert variant="danger">{validation.project_name_id}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
              </Form.Group>
              {validation.status && (
                <Alert variant="danger" className="mb-3">
                  {validation.status}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Sequence</Form.Label>
                <Form.Control type="number" value={sequence} onChange={(e) => setSequence(e.target.value)} />
              </Form.Group>
              {validation.sequence && (
                <Alert variant="danger" className="mb-3">
                  {validation.sequence}
                </Alert>
              )}
              {edit.id ? (
                <>
                  {loading ? (
                    <Button className="w-100" disabled variant="warning">
                      <Spinner as="span" animation="border" role="status" size="sm" />
                      <span className="visually-hidden">Loading...</span>
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
                      <Spinner as="span" animation="border" role="status" size="sm" />
                      <span className="visually-hidden">Loading...</span>
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

export default ProjectStatusIndex;
