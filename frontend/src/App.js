import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import TicketList from "./components/TicketList";
import CreateTicket from "./components/CreateTicket";
import EditTicket from "./components/EditTicket";
import ViewTicket from "./components/ViewTicket";

function App() {
  return (
    <Router>
      <Header />
      <Routes>

        <Route path="/" element={<TicketList />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/edit-ticket/:id" element={<EditTicket />} />
        <Route path="/view-ticket/:id" element={<ViewTicket />} />
      </Routes>

    </Router>
  );
}

export default App;