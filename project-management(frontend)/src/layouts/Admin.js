import Api from "../api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Navbar, NavDropdown } from "react-bootstrap";
import SidebarComponent from "../components/Sidebar";

const LayoutAdmin = ({ children, blur }) => {
  const [user, setUser] = useState({});
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  // function toggle handler
  const sidebarToggleHandler = (e) => {
    e.preventDefault();

    if (!sidebarToggle) {
      document.body.classList.add("sb-sidenav-toggled");

      setSidebarToggle(true);
    } else {
      document.body.classList.remove("sb-sidenav-toggled");

      setSidebarToggle(false);
    }
  };

  useEffect(() => {
    // fecth data user
    async function getData() {
      await Api.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setUser(response.data);
      });
    }

    getData();
  }, [token]);

  // function logout

  const logoutHandler = async (e) => {
    e.preventDefault();

    await Api.post("/api/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      Cookies.remove("token");

      toast.success("Logout Successfully", {
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      navigate("/");
    });
  };

  return (
    <>
      <div className="d-flex sb-sidenav-toggled" id="wrapper" style={{ filter: `blur(${blur}px)` }}>
        <div style={{ backgroundColor: "white" }} id="sidebar-wrapper">
          <div className="sidebar-heading bg-light text-center">
            <strong>
              <Link to="/project" style={{ textDecoration: 'none', color: 'white' }}>Project Management</Link>
            </strong>
          </div>

          <SidebarComponent />
        </div>

        <div id="page-content-wrapper">
          <Navbar className="navbar" bg="light" expand="sm">
            <Container fluid>
              <Button variant="success-dark" onClick={sidebarToggleHandler}>
                <i className="fa fa-list-ul"></i>
              </Button>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                  <NavDropdown title={user.name} className="fw-bold" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/project">
                      Project
                    </NavDropdown.Item>

                    {/* <NavDropdown.Item as={Link} to="/projectDetail">
                      Project Detail
                    </NavDropdown.Item> */}

                    <NavDropdown.Divider />

                    <NavDropdown.Item as={Link} to="/projectName">
                      Project Name
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/projectStatus">
                      Project Status
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/user">
                      Users
                    </NavDropdown.Item>

                    <NavDropdown.Divider />

                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </ul>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <div className="container-fluid">{children}</div>
        </div>
      </div>
    </>
  );
};

export default LayoutAdmin;
