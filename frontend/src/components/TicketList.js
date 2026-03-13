import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTickets } from "../features/tickets/ticketSlice";
import { useNavigate } from "react-router-dom";

const TicketList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, status } = useSelector((state) => state.tickets);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;
  useEffect(() => {
      dispatch(getTickets({
          limit: limit,
          offset: page * limit,
          status: statusFilter || undefined
      }));
  }, [dispatch, page, statusFilter]);

  const getStatusBadge = (status) => {

        switch (status) {
            case "NEW":
                return "bg-primary";

            case "IN_PROGRESS":
                return "bg-warning text-dark";

            case "DONE":
                return "bg-success";

            default:
                return "bg-primary";
        }

    };

    const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};

  return (
      <div className="container mt-4">
          <h5><strong>Ticket List</strong></h5>
          <hr/>
          {/* Status Filter */}
          <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                  <select className="form-control" style={{ width: "200px", display: "inline-block" }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} >
                      <option value="">All</option>
                      <option value="NEW">NEW</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="DONE">DONE</option>
                  </select>
              </div>
              <button className="btn btn-success" onClick={() => navigate("/create-ticket")} ><i className="fa fa-plus"></i> New Ticket</button>
          </div>
          {status === "loading" && <p>Loading...</p>}
          <table className="table table-bordered">
              <thead>
                  <tr>
                      <th>Slno.</th>
                      <th>Ticket ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th className="text-center">Status</th>
                      <th>Created At</th>
                      <th className="action-column"></th>
                  </tr>
              </thead>
              <tbody>
                  {tickets.map((ticket, index) => (
                  <tr key={ticket.id}>
                      <td style={{ textAlign: "center", width:"50px" }}>{page * limit + index + 1}</td>
                      <td style={{ width:"100px"}}>TKT{ticket.id}</td>
                      <td onClick={() => navigate(`/view-ticket/${ticket.id}`)} className="text-primary" style={{ cursor: "pointer" }}>{ticket.title}</td>
                      <td>{ticket.description}</td>
                      <td style={{ width: "100px" }}><span className={`badge w-100 py-2 ${getStatusBadge(ticket.status)}`}>{ticket.status}</span></td>
                      <td>{formatDate(ticket.created_at)}</td>
                      <td className="action-column">
                          <button className="btn btn-link btn-sm" onClick={() => navigate(`/edit-ticket/${ticket.id}`)}><i className="fa fa-pencil"></i> Edit</button>
                          <button className="btn btn-link btn-sm" onClick={() => navigate(`/delete-ticket/${ticket.id}`)}><i className="fa fa-trash"></i> Delete</button>
                      </td>
                  </tr>
                  ))}
              </tbody>
          </table>
          {/* Pagination */}
          <div className="d-flex gap-2">
              <button className="btn btn-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
              <button className="btn btn-primary" onClick={() => setPage(page + 1)}>Next</button>
          </div>
      </div>
  );
};

export default TicketList;