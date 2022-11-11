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

function ProjectNameIndex() {
  //title page

  document.title = "Project Name";

  //state posts

  const [projectNames, setProjectNames] = useState([]);

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
  const [requiredFile, setRequiredFile] = useState("0");

  const [validation, setValidation] = useState({});

  const [loading, setLoading] = useState(false);

  const [blur, setBlur] = useState(0);

  const [q, setQ] = useState("");
  const [searchParam] = useState(["name"]);

  //token

  const token = Cookies.get("token");

  //function "fetchData"

  const fetchData = async (pageNumber) => {
    //define variable "searchQuery"

    const page = pageNumber ? pageNumber : currentPage;

    setLoading(true);

    //fetching data from Rest API

    await Api.get(`/api/projectName?page=${page}`, {
      headers: {
        //header Bearer + Token

        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data response to state "categories"

      setProjectNames(response.data.data.data);

      //set currentPage

      setCurrentPage(response.data.data.current_page);

      //set perPage

      setPerPage(response.data.data.per_page);

      //total

      setTotal(response.data.data.total);

      setLoading(false);
    });
  };

  const data = Object.values(projectNames);
  const search = (projectNames) => {
    return projectNames.filter((projecName) => {
      return searchParam.some((newProjectName) => {
        return projecName[newProjectName]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
      });
    });
  };

  //hook

  useEffect(() => {
    //call function "fetchData"

    fetchData();
    console.log(requiredFile);

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
    setRequiredFile("0");
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
                <Card.Title >Are you sure?</Card.Title>
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
      formData.append("name", name);
      formData.append("sequence", sequence);
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
    }

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
  };

  const editHandler = (projectName) => {
    setEdit(projectName);
    setName(projectName.name);
    setSequence(projectName.sequence);
    setRequiredFile(projectName.required_file);
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
                <span className="fw-bold">PROJECT NAME</span>
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

                      <th>Name</th>

                      <th>Sequence</th>

                      <th className="text-nowrap">Required File</th>

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
                          search(data).map((projectName, index) => (
                            <tr key={projectName.id}>
                              <td>{++index + (currentPage - 1) * perPage}</td>
                              <td>{projectName.name}</td>
                              <td>{projectName.sequence}</td>
                              <td>{projectName.required_file === "0" ? 'No' : 'Yes'}</td>
                              <td>
                                <Button
                                  className="me-3 mb-3"
                                  variant="warning"
                                  onClick={() => {
                                    editHandler(projectName);
                                  }}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </Button>

                                <Button
                                  className=" mb-3"
                                  variant="danger"
                                  onClick={() => {
                                    deleteCategory(projectName.id);
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
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              {validation.name && <Alert variant="danger">{validation.name}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Sequence</Form.Label>
                <Form.Control type="text" value={sequence} onChange={(e) => setSequence(e.target.value)} />
              </Form.Group>
              {validation.sequence && (
                <Alert variant="danger" className="mb-3">
                  {validation.sequence}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Required File</Form.Label>
                <br />

                <Form.Check name="requiredFile" inline type="radio" label="no" value="0" onChange={(e) => setRequiredFile(e.target.value)} checked={requiredFile==="0" && true}/>
                <Form.Check name="requiredFile" inline type="radio" label="yes" value="1" onChange={(e) => setRequiredFile(e.target.value)} checked={requiredFile==="1" && true}/>
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

export default ProjectNameIndex;
