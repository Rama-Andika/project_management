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
import TableHead from "../../components/table/TableHead";
import Select from "react-select";

const columns = [
  { label: "Status", accessor: "status", sortable: true },
  { label: "Project Name", accessor: "project_name", sortable: true },
  { label: "Sequence", accessor: "sequence", sortable: false },
  { label: "Actions", accessor: "actions", sortable: false },
];

function ProjectStatusIndex() {
  document.title = "Project Status";

  const [projectStatuses, setProjectStatuses] = useState([]);
  // const [projectNames, setProjectNames] = useState([]);
  const [projectNameId, setProjectNameId] = useState({});

  const [edit, setEdit] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const [perPage, setPerPage] = useState(0);

  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const [sequence, setSequence] = useState("");
  const [status, setStatus] = useState("");

  const [validation, setValidation] = useState({});

  const [loading, setLoading] = useState(false);

  const [blur, setBlur] = useState(0);

  const [q, setQ] = useState("");

  const [options, setOptions] = useState([]);

  const token = Cookies.get("token");

  const fetchData = async (pageNumber, searchData) => {
    const page = pageNumber ? pageNumber : currentPage;
    const searchQuery = searchData ? searchData : q;

    setLoading(true);

    await Api.get(`/api/projectStatus?q=${searchQuery}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setProjectStatuses(response.data.data.data);

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
      if (response.data.data.length > 0) {
        // eslint-disable-next-line array-callback-return
        const optionsValue = response.data.data.map((p, i) => {
          const optionsCopy = [...options];
          return (optionsCopy[i] = { value: p.id, label: p.name, key:p.id });
        });

        setOptions(optionsValue);
      }
      // setProjectNames(response.data.data);
    });
  };

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(" ");
  }

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
    setProjectNameId("");
    setSequence("");
    setStatus("");
    setEdit({});
    setBlur(0);
  };

  const deleteStatus = (id) => {
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
                        await Api.delete(`/api/projectStatus/${id}`, {
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

  const storeStatus = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData();

    if (edit.id) {
      formData.append("project_name_id", projectNameId.value);
      formData.append("status", titleCase(status));

      formData.append("_method", "PATCH");

      await Api.post(`/api/projectStatus/${edit.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Update status succefully", {
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
      formData.append("project_name_id", projectNameId.value);
      formData.append("status", titleCase(status));
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
    }
  };

  const editHandler = (projectStatus) => {
    setEdit(projectStatus);
    setProjectNameId({value: projectStatus.project_name_id, label: projectStatus.project_name.name, key: projectStatus.project_name_id});
    setSequence(projectStatus.sequence);
    setStatus(projectStatus.status);
    handleShowModal();
  };

  const searchHandler = (e) => {
    e.preventDefault();

    fetchData(1, q);
  };

  const handleChangeSelect = (item) => {
   
    setProjectNameId(item);
    
  };



  const customeStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#edf2f4",
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#edf2f4",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? "#569cb8" : state.isFocused && "#caf0f8",
    }),
  };

  return (
    <React.Fragment>
      <LayoutAdmin blur={blur}>
        <Row className=" mt-4" style={{ filter: `blur(${blur}px)` }}>
          <Col xs={12}>
            <Card className=" border-0 rounded shadow-sm">
              <Card.Header>
                <span className="fw-bold">PROJECT STATUS</span>
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <Search onSubmit={searchHandler} value={q} onChange={(e) => setQ(e.target.value)} name="status, project" />
                  </Col>
                  <Col xs={2}>
                    <Addbutton size="md" onClick={handleShowModal} />
                  </Col>
                </Row>
                <Table responsive bordered hover>
                  <TableHead columns={columns} />

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <Loading size="lg" />
                        </td>
                      </tr>
                    ) : !projectStatuses.length > 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          Data Not Found
                        </td>
                      </tr>
                    ) : (
                      projectStatuses.map((projectStatus, index) => (
                        <tr key={projectStatus.id}>
                          <td>{projectStatus.status}</td>
                          <td>{projectStatus.project_name.name}</td>

                          <td>{projectStatus.sequence}</td>
                          <td>
                            <EditAction onEdit={() => editHandler(projectStatus)} />
                            <DeleteAction
                              onDelete={() => {
                                deleteStatus(projectStatus.id);
                              }}
                            />
                          </td>
                        </tr>
                      ))
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
            <Modal.Title>{edit.id ? "Edit Status" : "Create Status"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={storeStatus}>
              <Form.Group className="mb-3">
                <Form.Label>Project Name</Form.Label>

                {/* <Form.Select value={projectNameId} onChange={(e) => setProjectNameId(e.target.value)}>
                  <option value="">-- Select project --</option>
                  {projectNames.map((projectName) => (
                    <option key={projectName.id} value={projectName.id}>
                      {projectName.name}
                    </option>
                  ))}
                </Form.Select> */}
                {/* <SelectSearch options={projectNames.map((projectName)=>({name:projectName.name, value:projectName.id}))} value={projectNameId} search placeholder="Select..." onChange={setProjectNameId} /> */}
                <Select onChange={handleChangeSelect} defaultValue={projectNameId} options={options} noOptionsMessage={() => "Data not found"} styles={customeStyles} placeholder="Select project..." required />
              </Form.Group>
              {validation.project_name_id && <Alert variant="danger">{validation.project_name_id}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
           
              </Form.Group>
              {validation.status && (
                <Alert variant="danger" className="mb-3">
                  {validation.status}
                </Alert>
              )}

              {!edit.id && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Sequence</Form.Label>
                    <Form.Control type="number" value={sequence} onChange={(e) => setSequence(e.target.value)} required />
                  </Form.Group>
                  {validation.sequence && (
                    <Alert variant="danger" className="mb-3">
                      {validation.sequence}
                    </Alert>
                  )}
                </>
              )}
              {validation.errors && (
                <Alert variant="danger" className="mb-3">
                  {validation.errors}
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

export default ProjectStatusIndex;
