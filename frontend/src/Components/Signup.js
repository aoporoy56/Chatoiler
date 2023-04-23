import React, { useState } from "react";
import "./Signup.css";
import { Button, Form, InputGroup } from "react-bootstrap";
  import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cPassword, setCPassword] = useState();
  const [pic, setPic] = useState("");
  const [message, setMessage] = useState("");
  
  const picPost = async (pic)=>{
    if(pic == undefined){
      // console.log(object)
      setMessage("File Chosse")
      return;
    }
    if(pic.type === "image/jpeg" || pic.type === "image/png"){
      const data = new FormData();
      data.append("file",pic);
      data.append("upload_preset", "dfreqrdsy");
      data.append("cloud_name", "dfreqrdsy");
      await fetch("https://api.cloudinary.com/v1_1/dfreqrdsy/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data)
          setPic(data.url);
        });
    }
  }
  const formSubmit = async (e) =>{
    e.preventDefault(); 
    if(password !== cPassword){
      setMessage("Password Not Matched");
    }
    const {data} = await axios.post(
      "api/register",
      { name, email, password, pic },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    localStorage.setItem("userInfo", JSON.stringify(data));
    navigate("/chats");

  }
  return (
    <div>
      <h5>{message}</h5>
      <Form className="mt-3" onSubmit={formSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type={show ? "text" : "password"}
              placeholder="Password"
              aria-describedby="inputGroupPrepend"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <InputGroup.Text
              id="inputGroupPrepend"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              aria-describedby="inputGroupPrepend"
              onChange={(e) => setCPassword(e.target.value)}
              required
            />
            <InputGroup.Text
              id="inputGroupPrepend"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group className="position-relative mb-3">
          <Form.Label>File</Form.Label>
          <Form.Control
            type="file"
            name="file"
            accept="image/*"
            required
            onChange={(e) => picPost(e.target.files[0])}
            // isInvalid={!!errors.file}
          />
          <Form.Control.Feedback type="invalid" tooltip>
            {/* {errors.file} */}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
