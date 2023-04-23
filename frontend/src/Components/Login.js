import React, {useEffect, useState} from "react";
import { Form, Button } from "react-bootstrap";
import "./Login.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { ChatState } from "../Context/ChatProvider";

export default function Login() {
    const { user, setUser} = ChatState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  useEffect(()=>{
    localStorage.getItem("userInfo");
    if(user){
      navigate("/chats");
    }
  })
  const loginSubmit = async (e) =>{
    e.preventDefault();
    const { data } = await axios.post(
      "/api/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    if(data){
      setUser(localStorage.setItem("userInfo", JSON.stringify(data)));
      navigate("/chats");
    }
  }
  return (
    <>
      {!user && (
        <Form className="mt-3" onSubmit={loginSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          {/* <Row className="justify-content-space-between"> */}
          <Button variant="primary" type="submit" className="button">
            Submit
          </Button>
          {/* <Button variant="secondary" type="submit" className="button col-md-5">
          Reset
        </Button> */}
          {/* </Row> */}
          <Button variant="danger" type="submit" className="button">
            As Guest
          </Button>
        </Form>
      )}
    </>
  );
}
