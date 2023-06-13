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
import { Form, Alert, Col, Card, Row, Button } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ProjectCreate() {
  document.title = "Project Create";

  const [projectNames, setProjectNames] = useState([]);
  const [arrStatusProject, setArrStatusProject] = useState(Array.from(Array(projectNames.length)));

  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  const [note, setNote] = useState("-");

  const [sequence, setSequence] = useState([]);
  const [maxSequence, setMaxSequence] = useState([]);
  const [arrProjectStatus, setArrProjectStatus] = useState(Array.from(Array(projectNames.length)));
  const [arrFile, setArrFile] = useState(Array.from(Array(projectNames.length)));
  const [arrProjectNote, setArrProjectNote] = useState([]);

  const [validation, setValidation] = useState({});

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchProjectNames = async () => {
    setLoading(true);
    await Api.get("api/projectList", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjectNames(response.data.data);

      setLoading(false);
    });
  };

  const fetchProjectById = async () => {
    setLoading(true);
    await Api.get(`/api/project/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setName(response.data.data.project_name);
      setNote(response.data.data.note);

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

  const handleChangeFile = (e, index) => {
    const updateFile = e.target.files[0];

    const updateFiles = [...arrFile];
    updateFiles[index] = updateFile;
    setArrFile(updateFiles);

    const updateStatus = false;

    const updateStatuses = [...arrStatusProject];
    updateStatuses[index] = updateStatus;
    setArrStatusProject(updateStatuses);
  };

  const handleChangeProjectStatus = (e, index) => {
    const updateProjectStatus = e.target.value;

    const updateProjectStatues = [...arrProjectStatus];
    updateProjectStatues[index] = updateProjectStatus;
    setArrProjectStatus(updateProjectStatues);
  };

  const handleChangeProjectNote = (e, index) => {
    const updateProjectNote = e.target.value;

    const updateProjectNotes = [...arrProjectNote];
    updateProjectNotes[index] = updateProjectNote;
    setArrProjectNote(updateProjectNotes);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
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

  const searchMaxSequence = async (projectNameId, index) => {
    await Api.get(`api/searchMaxSequence/${projectNameId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      const updateMaxSequence = response.data.data;

      const updateMaxSequences = [...maxSequence];
      updateMaxSequences[index] = updateMaxSequence;
      setMaxSequence(updateMaxSequences);
    });
  };

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
      updateProjectNotes[index] = "-";
      setArrProjectNote(updateProjectNotes);
    } else if (arrProjectNote[index] === undefined) {
      const updateProjectNotes = [...arrProjectNote];
      updateProjectNotes[index] = "-";
      setArrProjectNote(updateProjectNotes);
      arrProjectNote[index] = "-";
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

    if (arrProjectStatus[index] !== undefined) {
      const formData = new FormData();
      formData.append("project_id", id);
      formData.append("project_name", name);
      formData.append("note", note);
      formData.append("project_name_id", projectName);
      formData.append("project_status_id", arrProjectStatus[index]);
      formData.append("document_attch", arrFile[index]);
      formData.append("project_note", arrProjectNote[index]);

      await Api.post("/api/project", formData, {
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

          setId(response.data.data.id);
          searchSequence(arrProjectStatus[index], index);
          searchMaxSequence(projectName, index);

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

          fetchProjectById();
        })
        .catch((error) => {
          toast.error("Saved project failed", {
            duration: 3000,
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setLoading(false);

          setValidation(error.response.data);
        });
    }
    setLoading(true);
    await delay(1000);
    setLoading(false);
  };

  const handleSubmitProject = (projectName, index) => {
    handleProject(projectName, index);
  };


  const downloadFile = async (fileDl) => {
    let download = require("downloadjs");

    await Api.get(`api/downloadFile/${fileDl}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }).then((res) => {
      download(res.data, fileDl);


    });
  };

  useEffect(() => {
    fetchProjectNames();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <LayoutAdmin>
        <Row className=" mt-4">
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

                      {projectNames.slice(0, 1).map((projectName, i) => (
                        <Card key={projectName.id} className="mb-5 border-0 rounded shadow-sm " style={{ backgroundColor: "#569cb8", display: "" }}>
                          <Card.Header className="text-white">{projectName.name}</Card.Header>
                          <Card.Body>
                            <Form.Group className="mb-3">
                              <Form.Label>Status</Form.Label>
                              <Form.Select value={arrProjectStatus[i]} onChange={(e) => handleChangeProjectStatus(e, i)}>
                                <option value="">-- Select Status --</option>
                                {projectName.project_statuses.map((projectStatus) => (
                                  <option key={projectStatus.id} value={projectStatus.id}>
                                    {projectStatus.status}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            {arrProjectStatus[i] === "" && <Alert variant="danger">The status field is required</Alert>}

                            {projectName.required_file === "1" && (
                              <>
                                <Form.Group className="mb-4">
                                  <Form.Label>File</Form.Label>
                                  <Form.Control type="file" onChange={(e) => handleChangeFile(e, i)} />

                                  <Button variant="link" className="mt-3" onClick={() => downloadFile(arrFile[i].name)} disabled={arrStatusProject[i] === true && arrFile[i] !== undefined ? false : true} style={{ textDecoration: "none" }}>
                                    <i class="fa-solid fa-download"></i> Download File
                                  </Button>
                                </Form.Group>
                                {validation.document_attch && <Alert variant="danger">{validation.document_attch}</Alert>}
                              </>
                            )}

                            <Form.Group className="mb-3">
                              <Form.Label>Note</Form.Label>
                              <Form.Control as="textarea" rows={3} value={arrProjectNote[i]} onChange={(e) => handleChangeProjectNote(e, i)} />
                            </Form.Group>

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
                          {projectName.sequence !== 1 && sequence[i - 1] !== undefined && sequence[i - 1] === maxSequence[i - 1] && (
                            <>
                              <Card className="mb-5 border-0 rounded shadow-sm " style={{ backgroundColor: "#569cb8", display: "" }}>
                                <Card.Header className="text-white">{projectName.name}</Card.Header>
                                <Card.Body>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select value={arrProjectStatus[i]} onChange={(e) => handleChangeProjectStatus(e, i)}>
                                      <option value="">-- Select Status --</option>
                                      {projectName.project_statuses.map((projectStatus) => (
                                        <option key={projectStatus.id} value={projectStatus.id}>
                                          {projectStatus.status}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                  {arrProjectStatus[i] === "" && <Alert variant="danger">The status field is required</Alert>}

                                  {projectName.required_file === "1" && (
                                    <>
                                      <Form.Group className="mb-3">
                                        <Form.Label>File</Form.Label>
                                        <Form.Control type="file" onChange={(e) => handleChangeFile(e, i)} />
                                        <Button variant="link" className="mt-3" onClick={() => downloadFile(arrFile[i].name)} disabled={arrStatusProject[i] === true && arrFile[i] !== undefined ? false : true}>
                                          <i class="fa-solid fa-download"></i> Download File
                                        </Button>
                                      </Form.Group>
                                      {validation.document_attch && <Alert variant="danger">{validation.document_attch}</Alert>}
                                    </>
                                  )}

                                  <Form.Group className="mb-3">
                                    <Form.Label>Note</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={arrProjectNote[i]} onChange={(e) => handleChangeProjectNote(e, i)} />
                                  </Form.Group>

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
                          )}
                        </>
                      ))}
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
