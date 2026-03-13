import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ViewTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [created_at, setCreatedAt] = useState("");

    useEffect(() => {

        axios.get(`http://127.0.0.1:8000/tickets/${id}`).then(res => {
            setTitle(res.data.title);
            setDescription(res.data.description);
            setStatus(res.data.status);
            setCreatedAt(res.data.created_at);
        }).catch(err => {
            if (err.response && err.response.status === 404) {
                navigate("/404");
            }
        });
    }, [id]);

    const getStatusBadge = () => {

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
            <button className="btn btn-secondary btn-sm mb-2" onClick={() => navigate(-1)}><i className="fas fa-arrow-left"></i></button>
            <h5><strong>Ticket Details</strong></h5>
            <hr/>
            
            <h6><strong>{title}</strong></h6>
            <small className="text-muted">Created at {formatDate(created_at)}</small>
            <br/>
            <span className={`badge ${getStatusBadge()}`}>{status}</span>
            <br/><br/>
            <p>{description}</p>
        </div>
    );
};

export default ViewTicket;