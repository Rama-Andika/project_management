//import react

import React, { useState, useEffect } from "react";

//import layout admin

import LayoutAdmin from "../../layouts/Admin";

//import BASE URL API
import Api from "../../api";

//import js cookie

import Cookies from "js-cookie";

import toast from "react-hot-toast";

import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { Button, Card, Col, Row, Form, Alert } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";

function ProjectEdit() {
  //title page

  document.title = "Project Edit";

  //state posts

  const [projectNames, setProjectNames] = useState([]);

  const [arrStatusProject, setArrStatusProject] = useState(Array.from(Array(projectNames.length)));

  //form project
  const [projectid, setProjectId] = useState(0);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  //form project detail
  const [projectNameId, setProjectNameId] = useState("");
  const [sequence, setSequence] = useState([]);
  const [arrProjectStatus, setArrProjectStatus] = useState([]);
  const [arrProjectNote, setArrProjectNote] = useState([]);
  const [file, setFile] = useState("-");

  const [validation, setValidation] = useState({});

  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  //token

  const token = Cookies.get("token");

  //function "fetchData"

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchProjectById = async () => {
    setLoading(true);
    await Api.get(`/api/project/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setName(response.data.data.project_name);
      setStatus(response.data.data.status);
      setNote(response.data.data.note);
      setProjectNameId(response.data.data.note);
      setStatus(response.data.data.status);

      const statusList = response.data.data.project_details.map((projectDetail, i) => {
        const updateProjectStatus = projectDetail.project_status_id;
        const updateProjectStatues = [...arrProjectStatus];
        return (updateProjectStatues[i] = updateProjectStatus);
      });

      const noteList = response.data.data.project_details.map((projectDetail, i) => {
        const updateProjectNote = projectDetail.project_note;
        const updateProjectNotes = [...arrProjectNote];
        return (updateProjectNotes[i] = updateProjectNote);
      });

      const sequenceList = response.data.data.project_details.map((projectDetail, i) => {
        const updateProjectSequence = projectDetail.project_status.sequence;
        const updateProjectSequences = [...sequence];
        return (updateProjectSequences[i] = updateProjectSequence);
      });

      setArrProjectStatus(statusList);
      setArrProjectNote(noteList);
      setSequence(sequenceList);

      setLoading(false);
    });
  };

  const searchSequence = async (projectStatusId, index) => {
    await Api.get(`api/searchSequence/${projectStatusId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      const updateSequence = response.data.data;

      const updateSequences = [...sequence];
      updateSequences[index] = updateSequence;
      setSequence(updateSequences);
    });
  };

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

  // useEffect(() => {
  //   fetchProjectByName(name);

  //   console.log(project);
  // }, [project, name]);

  const handleChangeFile = (e, index) => {
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
      formData.append("project_id", id);
      formData.append("project_name", name);
      formData.append("status", status);
      formData.append("note", note);
      formData.append("project_name_id", projectName);
      formData.append("project_status_id", arrProjectStatus[index]);
      formData.append("document_attch", file);
      formData.append("project_note", arrProjectNote[index]);

      await Api.post("/api/project/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          toast.success("Saved project succesffuly", {
            duration: 3000,
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });

          setProjectId(response.data.data.id);
          searchSequence(arrProjectStatus[index], index);

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

          setValidation(error.response.data);
        });
    }
    setLoading(true);
    await delay(1000);
    setLoading(false);
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
    fetchProjectById();

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

  const test = async () => {
    console.log("delete project detail")
  }

  const deleteProjectDetail =  (id, projectName)=>{
    // await Api.delete(`api/deleteProjectDetail/${id},${projectName}`,{
    //   headers:{
    //     Authorization:`Bearer ${token}`
    //   }
    // }).then(()=>{
    //   fetchProjectById()
    // })
    test()
    
  }
  

  

  return (
    <React.Fragment>
      <LayoutAdmin>
        <Row className=" mt-4">
          <Col xs={12}>
            <Card className=" border-0 rounded shadow-sm">
              <Card.Header>
                <span className="fw-bold">EDIT PROJECT</span>
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
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="0">In Progress</option>
                          <option value="1">Done</option>
                        </Form.Select>
                      </Form.Group>
                      {validation.status && <Alert variant="danger">{validation.status}</Alert>}

                      <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>
                        <ReactQuill theme="snow" rows="5" value={note} onChange={(content) => setNote(content)} />
                      </Form.Group>
                      {validation.note && <Alert variant="danger">{validation.note}</Alert>}

                      {projectNames.slice(0, 1).map((projectName, i) => (
                        <Card className="mb-5 border-0 rounded shadow-sm " style={{ backgroundColor: "#569cb8", display: "" }}>
                          <Card.Header className="text-white">{projectName.name}</Card.Header>
                          <Card.Body>
                            <Form.Group className="mb-3">
                              <Form.Label>Status</Form.Label>
                              <Form.Select value={arrProjectStatus[i]} onChange={(e) => handleChangeProjectStatus(e, i)}>
                                <option value="">-- Select Status --</option>
                                {projectName.project_statuses.map((projectStatus) => (
                                  <option value={projectStatus.id}>{projectStatus.status}</option>
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

                            <Button
                              variant="link"
                              disabled={loading ? true : false}
                              onClick={() => {
                                handleSubmitProject(projectName.id, i);
                              }}
                            >
                              Save
                            </Button>
                          </Card.Body>
                        </Card>
                      ))}

                      {projectNames.map((projectName, i) => (
                        <>
                          {/* <Form.Control type="hidden" value={++i} /> */}
                          {/* {projectName.project_statuses.map((projectStatus)=>(
                            
                          ))} */}
                          {projectName.sequence !== 1 && sequence[i - 1] === Math.max(...projectName.project_statuses.map((projectStatus) => projectStatus.project_name_id === projectName.id && projectStatus.sequence), 0) ? (
                            <>
                            {console.log(sequence[i-1])}
                              <Card className="mb-5 border-0 rounded shadow-sm " style={{ backgroundColor: "#569cb8", display: "" }}>
                                <Card.Header className="text-white">{projectName.name}</Card.Header>
                                <Card.Body>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select value={arrProjectStatus[i]} onChange={(e) => handleChangeProjectStatus(e, i)}>
                                      <option value="">-- Select Status --</option>
                                      {projectName.project_statuses.map((projectStatus) => (
                                        <option value={projectStatus.id}>{projectStatus.status}</option>
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
                                  <Button
                                    variant="link"
                                    disabled={loading ? true : false}
                                    onClick={() => {
                                      handleSubmitProject(projectName.id, i);
                                    }}
                                  >
                                    Save
                                  </Button>
                                </Card.Body>
                              </Card>
                            </>
                          ) : (
                            projectName.sequence !== 1 && sequence[i - 1] < Math.max(...projectName.project_statuses.map((projectStatus) => projectStatus.project_name_id === projectName.id && projectStatus.sequence), 0) && (
                              deleteProjectDetail()
                            )
                           
                          )}
                        </>
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

export default ProjectEdit;
