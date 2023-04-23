import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Chats from "./Pages/Chats";
import "./App.css";
import ChatProvider from "./Context/ChatProvider";

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className="App">
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/chats" Component={Chats} />
          </Routes>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"></script>

        <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"></script>

        <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"></script>
      </ChatProvider>
    </BrowserRouter>
  );
}
