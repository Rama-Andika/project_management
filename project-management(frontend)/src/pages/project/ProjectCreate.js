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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ProjectCreate() {
  //title page

  document.title = "Project Name";

  //state posts

  const [projectNames, setProjectNames] = useState([]);
  const [project, setProject] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [tempProject, setTempProject] = useState({});
  const [statusProject, setStatusProject] = useState(false);
  const [arrStatusProject, setArrStatusProject] = useState(Array.from(Array(projectNames.length)));
  const [arrProjectStatus, setArrProjectStatus] = useState(Array.from(Array(projectNames.length)));
  const [arrProjectNote, setArrProjectNote] = useState(Array.from(Array(projectNames.length)));
  

  const [statusProjectDetail, setStatusProjectDetail] = useState(false);

  const [edit, setEdit] = useState({});

  const [display, setDisplay] = useState(false);

  //state currentPage

  const [currentPage, setCurrentPage] = useState(1);

  //state perPage

  const [perPage, setPerPage] = useState(0);

  //state total

  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);

  //form project
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [note, setNote] = useState("");

  //form project detail
  const [projectNameId, setProjectNameId] = useState("");
  const [sequence, setSequence] = useState(0);
  const [projectStatus, setProjectStatus] = useState("");
  const [file, setFile] = useState("-");
  const [projectNote, setProjectNote] = useState("");

  const [requiredFile, setRequiredFile] = useState("0");

  const [validation, setValidation] = useState({});
  const [validationProjectDetail, setValidationProjectDetail] = useState({});

  const [loading, setLoading] = useState(false);

  const [blur, setBlur] = useState(0);

  const [q, setQ] = useState("");
  const [searchParam] = useState(["name"]);

  //token

  const token = Cookies.get("token");

  //function "fetchData"

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchProjectNames = async () => {
    setLoading(true);
    await Api.get("api/projectName", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjectNames(response.data.data.data);

      setLoading(false);
    });
  };

  const fetchProjectByName = async (sName) => {
    await Api.get(`api/searchByName/${sName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProject(response.data.data.id);
    });
  };

  // useEffect(() => {
  //   fetchProjectByName(name);

  //   console.log(project);
  // }, [project, name]);

  const handleChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChangeProjectStatus = (e, index) => {
    const updateProjectStatus = e.target.value;
    if (updateProjectStatus === "") {
      const updateProjectStatues = [...arrProjectStatus];
      updateProjectStatues[index] = "";
      setArrProjectStatus(updateProjectStatues);
    } else {
      const updateProjectStatues = [...arrProjectStatus];
      updateProjectStatues[index] = updateProjectStatus;
      setArrProjectStatus(updateProjectStatues);
    }
  };

  const handleChangeProjectNote = (e, index) => {
    const updateProjectNote = e.target.value;
    if (updateProjectNote === "") {
      const updateProjectNotes = [...arrProjectNote];
      updateProjectNotes[index] = "";
      setArrProjectNote(updateProjectNotes);
    } else {
      const updateProjectNotes = [...arrProjectNote];
      updateProjectNotes[index] = updateProjectNote;
      setArrProjectNote(updateProjectNotes);
    }
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
    const updateStatus = false;

    const updateStatuses = [...arrStatusProject];
    for (let index = 0; index < projectNames.length; index++) {
      updateStatuses[index] = updateStatus;
    }

    setArrStatusProject(updateStatuses);
  };

  // useEffect(() => {
  //   setStatusProjectDetail(statusProjectDetail);
  // }, [statusProjectDetail]);

  const handleProject = async (projectName, index) => {
    const updateStatus = false;
    setLoading(true);

    const updateStatuses = [...arrStatusProject];
    updateStatuses[index] = updateStatus;
    setArrStatusProject(updateStatuses);

    if (arrProjectNote[index] === undefined && arrProjectStatus[index] === undefined) {
      const updateProjectStatues = [...arrProjectStatus];
      updateProjectStatues[index] = "";
      setArrProjectStatus(updateProjectStatues);

      const updateProjectNotes = [...arrProjectNote];
      updateProjectNotes[index] = "";
      setArrProjectNote(updateProjectNotes);
    } else if (arrProjectNote[index] === undefined) {
      const updateProjectNotes = [...arrProjectNote];
      updateProjectNotes[index] = "";
      setArrProjectNote(updateProjectNotes);
    } else if (arrProjectStatus[index] === undefined) {
      const updateProjectStatues = [...arrProjectStatus];
      updateProjectStatues[index] = "";
      setArrProjectStatus(updateProjectStatues);
    } else if (arrProjectStatus[index] === "In Progress") {
      const updateProjectStatues = [...arrProjectStatus];
      updateProjectStatues[index + 1] = "";
      setArrProjectStatus(updateProjectStatues);
    } else {
      const updateProjectStatues = [...arrProjectStatus];
      updateProjectStatues[index] = arrProjectStatus[index];
      setArrProjectStatus(updateProjectStatues);

      const updateProjectNotes = [...arrProjectNote];
      updateProjectNotes[index] = arrProjectNote[index];
      setArrProjectNote(updateProjectNotes);
    }

    if (arrProjectNote[index] !== undefined && arrProjectStatus[index] !== undefined) {
      const formData = new FormData();
      const status = "0";
      formData.append("project_name", name);
      formData.append("status", status);
      formData.append("note", note);
      formData.append("project_name_id", projectName);
      formData.append("project_status", arrProjectStatus[index]);
      formData.append("document_attch", file);
      formData.append("project_note", arrProjectNote[index]);

      await Api.post("/api/project/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Saved project succesffuly", {
            duration: 3000,
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });

          setLoading(false);
          setValidation({});
          const updateStatus = true;

          const updateStatuses = [...arrStatusProject];
          updateStatuses[index] = updateStatus;
          setArrStatusProject(updateStatuses);

          const updateProjectStatus = arrProjectStatus[index];

          const updateProjectStatues = [...arrProjectStatus];
          updateProjectStatues[index] = updateProjectStatus;
          setArrProjectStatus(updateProjectStatues);

          const updateProjectNote = arrProjectNote[index];

          const updateProjectNotes = [...arrProjectNote];
          updateProjectNotes[index] = updateProjectNote;
          setArrProjectNote(updateProjectNotes);

          fetchProjectByName(name);
          // projectNames.map((p, i) => {
          //   handleProjectDetail(projectName + i, sequence + (i + 1));
          // });

          // if (statusProjectDetail) {
          //   toast.success("Saved project detail succesffuly", {
          //     duration: 4000,
          //     position: "top-right",
          //     style: {
          //       borderRadius: "10px",
          //       background: "#333",
          //       color: "#fff",
          //     },
          //   });
          // } else {
          //   toast.error("Saved project detail failed", {
          //     duration: 4000,
          //     position: "top-right",
          //     style: {
          //       borderRadius: "10px",
          //       background: "#333",
          //       color: "#fff",
          //     },
          //   });
          // }
        })
        .catch((error) => {
          setLoading(false);
          setStatusProject(false);
          setValidation(error.response.data);
        });
    }
    setLoading(true);
    await delay(1000);
    setLoading(false);
  };

  const handleProjectDetail = async (project, projectName, sequence) => {
    const formData = new FormData();
    formData.append("project_id", 1);
    formData.append("project_name_id", projectName);
    formData.append("sequence", sequence);
    formData.append("status", projectStatus);
    formData.append("document_attch", file);
    formData.append("note", projectNote);

    await Api.post("api/projectDetail", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success("Saved project detail succesffuly", {
          duration: 3000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setStatusProjectDetail(true);
        setSequence(sequence);
      })
      .catch((error) => {
        toast.error("Saved project detail failed", {
          duration: 3000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setLoading(false);
        setValidationProjectDetail(error.response.data);
      });
  };

  //hook

  const handleSubmitProject = (projectName, index) => {
    //e.preventDefault();
    // if(!status === "" && !file === "" && !projectNote === ""){

    // }

    handleProject(projectName, index);

    // if (project !== "") {
    //   console.log(project);
    //   handleProjectDetail(projectName);
    // }
  };

  useEffect(() => {
    //call function "fetchData"

    fetchProjectNames();
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

  return (
    <React.Fragment>
      <LayoutAdmin>
        <Row className=" mt-4" style={{ filter: `blur(${blur}px)` }}>
          <Col xs={12}>
            <Card className=" border-0 rounded shadow-sm">
              <Card.Header>
                <span className="fw-bold">CREATE PROJECT</span>
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col xs={12}>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={handleChangeName} />
                      </Form.Group>
                      {validation.project_name && <Alert variant="danger">{validation.project_name}</Alert>}

                      <Form.Control type="hidden" value={id} />

                      <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>
                        <ReactQuill theme="snow" rows="5" value={note} onChange={(content) => setNote(content)} />
                      </Form.Group>
                      {validation.note && <Alert variant="danger">{validation.note}</Alert>}

                      {projectNames.map((projectName, i) => (

                        <Card className="mb-5 border-0 rounded shadow-sm " style={{ backgroundColor: "#569cb8", display: "" }}>
                          <Card.Header className="text-white">{projectName.name}</Card.Header>
                          <Card.Body>
                            <Form.Group className="mb-3">
                              <Form.Label>Status</Form.Label>
                              <Form.Select value={arrProjectStatus[i]} onChange={(e) => handleChangeProjectStatus(e, i)}>
                                <option value="">-- Select Status --</option>
                                {projectName.project_statuses.map((projectStatus) => (
                                  <option value={projectStatus.status}>{projectStatus.status}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            {arrProjectStatus[i] === "" && <Alert variant="danger">The status field is required</Alert>}

                            {projectName.required_file === "1" && (
                              <>
                                <Form.Group className="mb-3">
                                  <Form.Label>File</Form.Label>
                                  <Form.Control type="file" onChange={handleChangeFile} />
                                </Form.Group>
                                {validation.document_attch && <Alert variant="danger">{validation.document_attch}</Alert>}
                              </>
                            )}

                            <Form.Group className="mb-3">
                              <Form.Label>Note</Form.Label>
                              <Form.Control as="textarea" rows={3} value={arrProjectNote[i]} onChange={(e) => handleChangeProjectNote(e, i)} />
                            </Form.Group>

                            {arrProjectNote[i] === "" && <Alert variant="danger">The note field is required</Alert>}
                            {loading ? (
                              <Button disabled variant="link" name="btnSpinner">
                                <Spinner as="span" animation="border" role="status" size="sm" />
                                <span className="visually-hidden">Loading...</span>
                              </Button>
                            ) : (
                              <Button
                                variant="link"
                                onClick={() => {
                                  handleSubmitProject(projectName.id, i);
                                }}
                              >
                                Save
                              </Button>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                      {/* <Button type="submit">Simpan</Button> */}
                    </Form>
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

export default ProjectCreate;
