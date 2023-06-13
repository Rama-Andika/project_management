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
import { Button, Card, Col, Row, Table, Form, Modal, Spinner } from "react-bootstrap";
import Moment from "react-moment";
import DatePicker from "react-date-picker";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Select from "react-select";

function ProjectIndex() {
  document.title = "Project";

  const [projects, setProjects] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [status, setStatus] = useState("-1");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [perPage, setPerPage] = useState(0);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  const [options, setOptions] = useState([]);

  const [number, setNumber] = useState("PRJ");

  const fetchData = async (pageNumber, sStatus, sNumber, firstDate, secondDate) => {
    const page = pageNumber ? pageNumber : currentPage;
    const date1 = format(firstDate ? firstDate : startDate, "yyyy-MM-dd");
    const date2 = format(secondDate ? secondDate : endDate, "yyyy-MM-dd");
    const tempNumber = sNumber ? sNumber : number;
    const tempStatus = sStatus ? sStatus : status;

    setLoading(true);

    await Api.get(`/api/searchBy/${tempStatus},${tempNumber},${date1},${date2}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjects(response.data.data.data);

      setCurrentPage(response.data.data.current_page);

      setPerPage(response.data.data.per_page);

      setTotal(response.data.data.total);

      setLoading(false);
    });
  };

  const fetchProjectName = async () => {
    await Api.get("/api/projectList", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjectNames(response.data.data);
    });
  };

  const fetchProjectNumber = async () => {
    await Api.get("/api/numberList", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.data.data.length > 0) {
        const optionsValue = response.data.data.map((p, i) => {
          const optionsCopy = [...options];
          return (optionsCopy[i] = { value: p.number, label: p.number });
        });

        setOptions(optionsValue);
      }
    });
  };

  useEffect(() => {
    fetchData();
    fetchProjectName();
    fetchProjectNumber();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchHandler = (e) => {
    e.preventDefault();

    fetchData(1, status, number, startDate, endDate);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBlur(0);
  };

  const deleteProject = (projectId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <Card style={{ background: "#00b4d8" }}>
              <Card.Body className="text-black">
                <Card.Title>Are you sure?</Card.Title>
                <Card.Text>You want to delete this project</Card.Text>
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
                        await Api.delete(`/api/project/${projectId}`, {
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
                          fetchProjectNumber();
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

  const customeStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      width: "50%",
      backgroundColor: "#edf2f4",
      border: state.isFocused ? "1px solid #569cb8" : "0.1px solid hsl(0, 0%, 80%)",
      boxShadow: state.isFocused && "0px 0px 0px #569cb8",
      "&:hover": {
        borderColor: "#569cb8",
      },
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      width: "50%",
      backgroundColor: "#edf2f4",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? "#569cb8" : state.isFocused && "#caf0f8",
    }),
  };

  return (
    <React.Fragment>
      <LayoutAdmin>
        <Row className=" mt-4" style={{ filter: `blur(${blur}px)` }}>
          <Col xs={12}>
          
            <Card className="border-0 rounded shadow-sm">
              <Card.Header>
                <span className="fw-bold">PROJECT</span>
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col xs={12} className="mb-4">
                    <p>
                      <strong>Search Parameter :</strong>
                    </p>
                    <Form onSubmit={searchHandler}>
                      <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label>Project Status</Form.Label>

                        <Select
                          onChange={(e) => setStatus(e.value)}
                          defaultValue={status}
                          options={[
                            { value: "-1", label: "All" },
                            { value: "0", label: "In Progress" },
                            { value: "1", label: "Done" },
                          ]}
                          noOptionsMessage={() => "Data not found"}
                          styles={customeStyles}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Label>Number</Form.Label>

                        <Select onChange={(e) => setNumber(e.value)} defaultValue={number} options={[{ value: "PRJ", label: "All" }, ...options]} noOptionsMessage={() => "Data not found"} styles={customeStyles} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicDate">
                        <Form.Label>Date Between</Form.Label>
                        <Row>
                          <Col xs={12} sm={4} className="form-width">
                            <DatePicker
                              format="MM-dd-y"
                              clearIcon={null}
                              calendarIcon=<i className="fa-regular fa-calendar"></i>
                              onChange={(date) => {
                                setStartDate(date);
                              }}
                              value={startDate}
                            />
                          </Col>

                          <Col xs={12} sm={4} className="form-width">
                            s/d
                          </Col>

                          <Col xs={12} sm={4} className="form-width">
                            <DatePicker
                              format="MM-dd-y"
                              clearIcon={null}
                              calendarIcon=<i className="fa-regular fa-calendar"></i>
                              onChange={(date) => {
                                setEndDate(date);
                              }}
                              value={endDate}
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                      <Button variant="success" type="submit">
                        <span>
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </span>{" "}
                        Search
                      </Button>
                    </Form>
                  </Col>
                </Row>
                <Table responsive bordered hover>
                  <thead style={{ backgroundColor: "#569cb8" }} className="text-white">
                    <tr>
                      <th>No</th>

                      <th>Action</th>

                      <th>Status</th>

                      <th>Number</th>

                      <th>Date</th>

                      <th className="text-nowrap">Project Name</th>

                      {projectNames.map((projectName) => (
                        <th key={projectName.id} className="text-nowrap">
                          {projectName.name}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6 + projectNames.length} className="text-center py-4">
                          <Spinner animation="border" size="lg" role="status" />
                          <span className="visually-hidden">...loading</span>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {!projects.length > 0 ? (
                          <tr>
                            <td colSpan={6 + projectNames.length} className="text-center py-4">
                              Data Not Found
                            </td>
                          </tr>
                        ) : (
                          projects.map((project, index) => (
                            <tr key={project.id}>
                              <td className="text-center">{++index + (currentPage - 1) * perPage}</td>
                              <td className="text-center">
                                <Button size="sm" className=" mb-3" variant="danger" onClick={() => deleteProject(project.id)}>
                                  <i className="fa-solid fa-trash fa-2xs"></i>
                                </Button>
                              </td>
                              <td className="text-center">{project.status === 1 ? <i className="fa-solid fa-check" style={{ color: "green" }}></i> : <i className="fa-solid fa-xmark" style={{ color: "red" }}></i>}</td>

                              <td className="text-nowrap">
                                <Link to={`/projectEdit/${project.id}`}>{project.number}</Link>
                              </td>

                              <td className="text-nowrap">
                                <Moment format="DD MMMM, YYYY">{project.created_at}</Moment>
                              </td>

                              <td className="text-nowrap">{project.project_name}</td>

                              {projectNames.map((projectName) =>
                                project.project_details.map((projectDetail, i) => (projectName.id === projectDetail.project_name_id ? <td className="text-nowrap">{projectDetail.project_status.status}</td> : ""))
                              )}
                            </tr>
                          ))
                        )}
                      </>
                    )}
                  </tbody>
                </Table>
                <Row className="mt-5">
                  <Col xs={12}>
                    <Button as={Link} to="/projectCreate" className="btn-add">
                      Add New
                    </Button>
                  </Col>
                  <Col xs={12} className="mt-3">
                    <PaginationComponent currentPage={currentPage} perPage={perPage} total={total} onChange={(pageNumber) => fetchData(pageNumber)} position="end" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Actions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="text-center">
              <Col>
                <Button size="lg" className="me-3 mb-3" variant="warning" onClick={""}>
                  Edit <i className="fa-solid fa-pen-to-square fa-2xs"></i>
                </Button>
              </Col>
              <Col>
                <Button size="lg" className=" mb-3" variant="danger" onClick={""}>
                  Delete <i className="fa-solid fa-trash fa-2xs"></i>
                </Button>
              </Col>
            </Row>
          </Modal.Body>
          
          <Modal.Footer></Modal.Footer>
        </Modal>
      </LayoutAdmin>
    </React.Fragment>
  );
}

export default ProjectIndex;
