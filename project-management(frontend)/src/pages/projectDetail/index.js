import { Button, Card, Col, Form, InputGroup, Row, Spinner, Table } from "react-bootstrap";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import PaginationComponent from "../../../components/admin/Pagination";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";

import { Link } from "react-router-dom";

const PlacesIndex = () => {
  document.title = "Places - Administrator Rama Wisata";

  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [searchParam] = useState(["title", "phone", "website", "office_hours", "address"]);

  const token = Cookies.get("token");

  const fetchData = async (pageNumber) => {
    const page = pageNumber ? pageNumber : currentPage;
    setLoading(true);
    await Api.get(`/api/admin/places?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPlaces(response.data.data.data);
      setCurrentPage(response.data.data.current_page);
      setPerPage(response.data.data.per_page);
      setTotal(response.data.data.total);
      setLoading(false);
    });
  };


 const data = Object.values(places)
  function search(places) {
    return places.filter((place) => {
      return searchParam.some((newPlace) => {
        return place[newPlace]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
      });
    });
  }
  //hook
  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 
  const deleteHandler = async (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <Card style={{ background: "#00b4d8" }}>
              <Card.Body className="text-white">
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
                        await Api.delete(`/api/admin/places/${id}`, {
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
    <>
      <LayoutAdmin>
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="border-0 shadow-sm rounded">
              <Card.Header>
                <span className="fw-bold">
                  <i className="fa fa-map-marked"></i> PLACES
                </span>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <InputGroup className="mb-3">
                      <Form.Control type="search" name="search-form" placeholder="Search for..." value={q} onChange={(e) => setQ(e.target.value)} />
                    </InputGroup>
                  </Col>
                  <Col xs={2}>
                    <Link to="/admin/places/create">
                      <Button className="rounded-circle float-end" size="sm" style={{ background: "#06d6a0" }}>
                        <i className="fa-solid fa-plus fa-lg"></i>
                      </Button>
                    </Link>
                  </Col>
                </Row>
                <Table responsive bordered striped hover>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Address</th>
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
                        {
                          // eslint-disable-next-line eqeqeq
                          search(data) == "" ? (
                            <tr>
                              <td colSpan={5} className="text-center py-4">
                                Data not found
                              </td>
                            </tr>
                          ) : (
                            <>
                              {search(data).map((place, index) => (
                                <tr key={index}>
                                  <td>{++index + (currentPage - 1) * perPage}</td>
                                  <td>{place.title}</td>
                                  <td>{place.category.name}</td>
                                  <td>{place.address}</td>
                                  <td>
                                    <Link to={`/admin/places/edit/${place.id}`}>
                                      <Button className="me-3 mb-3" variant="warning" onClick={() => {}}>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                      </Button>
                                    </Link>

                                    <Button className=" mb-3" variant="danger" onClick={() => deleteHandler(place.id)}>
                                      <i className="fa-solid fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )
                        }
                      </>
                    )}
                  </tbody>
                </Table>
                <PaginationComponent position="end" currentPage={currentPage} perPage={perPage} total={total} onChange={(pageNumber) => fetchData(pageNumber)} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </LayoutAdmin>
    </>
  );
};

export default PlacesIndex;
