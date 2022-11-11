import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../api";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

const Dashboard = () => {
  document.title = "Dashboard - Administrator Rama Travel";

  const [categories, setCategories] = useState(0);
  const [places, setPlaces] = useState(0);
  const [users, setUsers] = useState(0);
  const [sliders, setSliders] = useState(0);

  const token = Cookies.get("token");

  useEffect(() => {
    async function fetchData() {
      const response = await Api.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.data.data;

      setCategories(data.categories);
      setPlaces(data.places);
      setUsers(data.users);
      setSliders(data.sliders);
    }

    fetchData();
  }, [token]);

  return (
    <React.Fragment>
      <LayoutAdmin>
        <Row className="mt-4">
          <Col xs={12} lg={3} className="mb-4">
            <Card className="border-0 shadow-sm overflow-hidden">
              <Card.Body className="p-0 text-center">
                <Row>
                  <Col xs={6} sm={4} md={4} lg={12} xl={6}>
                    <div className="py-4 px-5" style={{ background: "#264653" }}>
                      <i className="fas fa-folder fa-2x text-white"></i>
                    </div>
                  </Col>
                  <Col xs={5} sm={8} md={8} lg={12} xl={5}>
                    <div className="py-3 text-nowrap">
                      <div>{categories}</div>

                      <div className="text-muted text-uppercase fw-bold small">CATEGORIES</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={3} className="mb-4">
            <Card className=" border-0 rounded shadow-sm overflow-hidden">
              <Card.Body className=" p-0 text-center">
                <Row>
                  <Col xs={6} sm={4} md={4} lg={12} xl={6}>
                    <div className="py-4 px-5" style={{ background: "#f4a261" }}>
                      <i className="fas fa-map-marked fa-2x text-white"></i>
                    </div>
                  </Col>
                  <Col xs={5} sm={8} md={8} lg={12} xl={5}>
                    <div className="py-3 text-nowrap">
                      <div>{places}</div>

                      <div className="text-muted text-uppercase fw-bold small">places</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={3} className="mb-4">
            <Card className=" border-0 rounded shadow-sm overflow-hidden">
              <Card.Body className="p-0 text-center">
                <Row>
                  <Col xs={6} sm={4} md={4} lg={12} xl={6}>
                    <div className="py-4 px-5" style={{ background: "#e9c46a" }}>
                      <i className="fas fa-images fa-2x text-white"></i>
                    </div>
                  </Col>
                  <Col xs={5} sm={8} md={8} lg={12} xl={5}>
                    <div className="py-3 text-nowrap">
                      <div>{sliders}</div>

                      <div className="text-muted text-uppercase fw-bold small">slider</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={3} className="mb-4">
            <Card className=" border-0 rounded shadow-sm overflow-hidden">
              <Card.Body className="p-0 text-center">
                <Row>
                  <Col xs={6} sm={4} md={4} lg={12} xl={6}>
                    <div className="py-4 px-5" style={{ background: "#2a9d8f" }}>
                      <i className="fas fa-users fa-2x text-white"></i>
                    </div>
                  </Col>
                  <Col xs={5} sm={8} md={8} lg={12} xl={5}>
                    <div className="py-3 text-nowrap">
                      <div>{users}</div>

                      <div className="text-muted text-uppercase fw-bold small">users</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </LayoutAdmin>
    </React.Fragment>
  );
};

export default Dashboard;
