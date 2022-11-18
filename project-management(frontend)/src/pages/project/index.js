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

function ProjectIndex() {
  //title page

  document.title = "Project";

  //state posts

  const [projects, setProjects] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [projectNumbers, setProjectNumbers] = useState([]);
  const [status, setStatus] = useState("-1");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(0);

  //state currentPage

  const [currentPage, setCurrentPage] = useState(1);

  //state perPage

  const [perPage, setPerPage] = useState(0);

  //state total

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  //token

  const token = Cookies.get("token");

  const [number, setNumber] = useState("PRJ");

  //function "fetchData"

  const fetchData = async (pageNumber, sStatus, sNumber, firstDate, secondDate) => {
    //define variable "searchQuery"

    const page = pageNumber ? pageNumber : currentPage;
    const date1 = format(firstDate ? firstDate : startDate, "yyyy-MM-dd");
    const date2 = format(secondDate ? secondDate : endDate, "yyyy-MM-dd");
    const tempNumber = sNumber ? sNumber : number;
    const tempStatus = sStatus ? sStatus : status;

    setLoading(true);

    //fetching data from Rest API

    await Api.get(`/api/searchBy/${tempStatus},${tempNumber},${date1},${date2}?page=${page}`, {
      headers: {
        //header Bearer + Token

        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data response to state "categories"

      setProjects(response.data.data.data);

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

  const fetchProjectNumber = async () => {
    await Api.get("/api/numberList", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjectNumbers(response.data.data);
    });
  };

  //hook

  useEffect(() => {
    //call function "fetchData"

    fetchData();
    fetchProjectName();
    fetchProjectNumber();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                    <Form onSubmit={searchHandler}>
                      <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label>Project Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "50%" }}>
                          <option value="-1">-- All --</option>
                          <option value="0">In Progress</option>
                          <option value="1">Done</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Label>Number</Form.Label>
                        <Form.Select value={number} onChange={(e) => setNumber(e.target.value)} style={{ width: "50%" }}>
                          <option value="PRJ">-- All Number --</option>
                          {projectNumbers.map((projectNumber) => (
                            <option key={projectNumber.id} value={projectNumber.number}>{projectNumber.number}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicDate">
                        <Form.Label>Date Between</Form.Label>
                        <Row>
                          <Col xs={12} sm={4} className="form-width">
                            <DatePicker
                              format="MM-dd-y"
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
                  <thead>
                    <tr>
                      <th>Action</th>
                      
                      <th>No</th>

                      <th>Number</th>

                      <th>Date</th>

                      <th className="text-nowrap">Project Name</th>

                      {projectNames.map((projectName) => (
                        <th key={projectName.id} className="text-nowrap">{projectName.name}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5 + projectNames.length} className="text-center py-4">
                          <Spinner animation="border" size="lg" role="status" />
                          <span className="visually-hidden">...loading</span>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {projects === "" ? (
                          <tr>
                            <td colSpan={5 + projectNames.length} className="text-center py-4">
                              Data Not Found
                            </td>
                          </tr>
                        ) : (
                          projects.map((project, index) => (
                            <tr key={project.id}>
                              <td className="text-center">
                                <Button size="sm" className=" mb-3" variant="danger" onClick={() => deleteProject(project.id)}>
                                  <i className="fa-solid fa-trash fa-2xs"></i>
                                </Button>
                              </td>
                              <td>{++index + (currentPage - 1) * perPage}</td>
                              {/* <Link to={`/projectEdit/${project.id}`}>
                                <td className="text-nowrap">{project.number}</td>
                              </Link> */}
                              <td className="text-nowrap">
                                <Link to={`/projectEdit/${project.id}`}>{project.number}</Link>
                              </td>
                              {/* <Link onClick={() => actionsHandler(project)}>
                                <td className="text-nowrap">{project.number}</td>
                              </Link> */}

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
                  <Col>
                    <Button as={Link} to="/projectCreate" className="btn-add">
                      Add New
                    </Button>
                  </Col>
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
