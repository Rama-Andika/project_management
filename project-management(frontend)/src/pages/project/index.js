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
import { Button, Card, Col, InputGroup, Row, Table, Form, Modal, Alert, Spinner, Dropdown } from "react-bootstrap";
import Moment from "react-moment";
import DatePicker from "react-date-picker";
import { compareAsc, format } from "date-fns";

function ProjectIndex() {
  //title page

  document.title = "Project Status";

  //state posts

  const [project, setProject] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [projectNumbers, setProjectNumbers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  

  const [edit, setEdit] = useState({});

  //state currentPage

  const [currentPage, setCurrentPage] = useState(1);

  //state perPage

  const [perPage, setPerPage] = useState(0);

  //state total

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [searchParam] = useState(["status"]);

  //token

  const token = Cookies.get("token");

  const [number, setNumber] = useState("PRJ");

  //function "fetchData"

  const fetchData = async (pageNumber, sNumber, firstDate, secondDate) => {
    //define variable "searchQuery"

    const page = pageNumber ? pageNumber : currentPage;
    const date1 = format(firstDate ? firstDate : startDate, 'yyyy-MM-dd')
    const date2 = format(secondDate ? secondDate : endDate, 'yyyy-MM-dd')
    const tempNumber =  sNumber ? sNumber : number; 


  
    
    setLoading(true);

    //fetching data from Rest API

    await Api.get(`/api/searchBy/${tempNumber},${date1},${date2}?page=${page}`, {
      headers: {
        //header Bearer + Token

        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data response to state "categories"

      setProject(response.data.data.data);

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
    await Api.get("/api/project", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjectNumbers(response.data.data.data);
    });
  }

  const data = Object.values(project);
  const search = (project) => {
    return project.filter((projectDetail) => {
      return searchParam.some((newProject) => {
        return projectDetail[newProject]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
      });
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

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }

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
    e.preventDefault()

    fetchData(1, number, startDate, endDate)
    
  }

  return (
    <React.Fragment>
      <LayoutAdmin>
        <Row className=" mt-4">
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
                        <Form.Select value={""} onChange={""}>
                          <option value="-1">-- All --</option>
                          <option value="0">In Progress</option>
                          <option value="1">Done</option>
                        </Form.Select>
                        <Form.Control type="text" style={{ width:'50%' }}/>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Label>Number</Form.Label>
                        <Form.Select value={number} onChange={(e)=>setNumber(e.target.value)} style={{ width:'50%' }}>
                          <option value="PRJ">-- All Number --</option>
                          {projectNumbers.map((projectNumber) => (
                            <option value={projectNumber.number}>{projectNumber.number}</option>
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
                                setStartDate(date)
                              }}
                              value={startDate}
                             
                            />
                          </Col>

                          <Col xs={12} sm={4}  className="form-width">
                            s/d
                          </Col>

                          <Col xs={12} sm={4}  className="form-width">
                            <DatePicker
                              format="MM-dd-y"
                              onChange={(date) => {
                                setEndDate(date)
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
                <Table responsive bordered striped hover>
                  <thead>
                    <tr>
                      <th>No.</th>

                      <th>Number</th>

                      <th>Date</th>

                      <th className="text-nowrap">Project Name</th>

                      {projectNames.map((projectName) => (
                        <th className="text-nowrap">{titleCase(projectName.name)}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          <Spinner animation="border" size="lg" role="status" />
                          <span className="visually-hidden">...loading</span>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {project === "" ? (
                          <tr>
                            <td colSpan={4} className="text-center py-4">
                              Data Not Found
                            </td>
                          </tr>
                        ) : (
                          project.map((projectDetail, index) => (
                            <tr key={projectDetail.id}>
                              <td>{++index + (currentPage - 1) * perPage}</td>

                              <td className="text-nowrap">{projectDetail.number}</td>
                              <td className="text-nowrap">
                                <Moment format="DD MMMM, YYYY">{projectDetail.created_at}</Moment>
                              </td>

                              <td className="text-nowrap">{projectDetail.project_name}</td>

                              {projectNames.map((projectName) => 
                                projectDetail.project_details.map((projectDetail, i) => (
                                  <td>{i}</td>
                                )
                   
                              ))}
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
      </LayoutAdmin>
    </React.Fragment>
  );
}

export default ProjectIndex;
