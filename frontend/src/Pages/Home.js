import React, { useEffect } from "react";
import { Button, Col, Container, Row, Tab, Nav } from "react-bootstrap";
import "./Home.css";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import "react-toastify/dist/ReactToastify.min.css";
import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats")
    }
  }, []);
  return (
    <Container>
      <Row className="d-flex justify-content-center">
        <div className="col-md-6">
          <Row className="header">
            <Col>
            <Logo />
            </Col>
          </Row>
          <Row className="content mt-3 p-3">
            <Col>
              <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row className="d-block">
                  <Col>
                    <Nav
                      variant="pills"
                      className="nav flex-row justify-content-center"
                    >
                      <Nav.Item className="nav-button">
                        <Nav.Link eventKey="first">Login</Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="nav-button">
                        <Nav.Link eventKey="second">Sign UP</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col>
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <Login />
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <Signup />
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Col>
          </Row>
        </div>
      </Row>
    </Container>
  );
}
