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
import { Button, Card, Col, Row, Table, Form, Modal, Alert, Spinner, Tooltip, OverlayTrigger } from "react-bootstrap";
import Search from "../../components/Search";
import Loading from "../../components/Loading";
import Addbutton from "../../components/Addbutton";
import EditAction from "../../components/EditAction";
import DeleteAction from "../../components/DeleteAction";

const columns = [
  { label: "Name", accessor: "name", sortable: true },
  { label: "Sequence", accessor: "sequence", sortable: true },
  { label: "Required File", accessor: "required_file", sortable: false },
  { label: "Actions", accessor: "actions", sortable: false },
];

function ProjectNameIndex() {


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

  //token

  const token = Cookies.get("token");

  //function "fetchData"

  const fetchData = async (pageNumber, searchData) => {
    //define variable "searchQuery"

    const page = pageNumber ? pageNumber : currentPage;
    const searchQuery = searchData ? searchData : q;

    setLoading(true);

    //fetching data from Rest API

    await Api.get(`/api/projectName?page=${page}&q=${searchQuery}`, {
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

  //hook

  useEffect(() => {
    //call function "fetchData"

    fetchData();

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
                    <Search onSubmit={searchHandler} value={q} onChange={(e) => setQ(e.target.value)} />
                  </Col>
                  <Col xs={2}>
                    <Addbutton size="md" onClick={handleShowModal} />
                  </Col>
                </Row>
                <Table responsive bordered hover>
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
                      projectNames.map((projectName, index) => (
                        <tr key={projectName.id}>
                          <td>{++index + (currentPage - 1) * perPage}</td>
                          <td>{projectName.name}</td>
                          <td>{projectName.sequence}</td>
                          <td>{projectName.required_file === "0" ? "No" : "Yes"}</td>
                          <td>
                            <OverlayTrigger
                              placement="right"
                              overlay={
                                <Tooltip id={`Edit`}>
                                  Tooltip on <strong>Edit</strong>.
                                </Tooltip>
                              }
                            >
                              <EditAction onEdit={() => editHandler(projectName)} />
                            </OverlayTrigger>
                            
                            <DeleteAction
                              onDelete={() => {
                                deleteProjectName(projectName.id);
                              }}
                            />
                          </td>
                        </tr>
                      ))
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
            <Modal.Title>{edit.id ? "Edit Project" : "Create Project"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={storeProjectName}>
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
