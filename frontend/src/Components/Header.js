import React, { useContext, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import OffCanvas from "../Modal/OffCanvas";
import { BsSearch, BsBellFill } from "react-icons/bs";
import "./Header.css";
import { IoMdArrowDropdown } from "react-icons/io";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import Profile from "../Modal/Profile";

export default function Header() {
  const { user } = ChatState();
  const navigate = useNavigate();
  const [OffCanvasShow, setOffCanvasShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modelClose = () => {
    setShowModal(false);
  };
  return (
    <div className="top-header">
      <h3>Chatoiler</h3>

      <div className="search-box"></div>

      <Dropdown>
        <Button className="mr-3" onClick={() => setOffCanvasShow(true)}>
          <BsSearch />
          {/* <h5>Search</h5> */}
        </Button>
        <OffCanvas value={OffCanvasShow} valueChange={setOffCanvasShow} />

        <Dropdown.Toggle id="dropdown-basic">
          <BsBellFill className="mx-3" />
          <img
            src={user.pic}
            // src="./profile.jpg"
            alt=""
            width={"30px"}
            style={{
              borderRadius: "50%",
            }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#" onClick={() => setShowModal(true)}>
            Profile
          </Dropdown.Item>

          <Profile
            user={user}
            setShowModal={setShowModal}
            showModal={showModal}
          />
          <Dropdown.Item
            href="#"
            onClick={() => {
              localStorage.removeItem("userInfo");
              navigate("/");
            }}
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
