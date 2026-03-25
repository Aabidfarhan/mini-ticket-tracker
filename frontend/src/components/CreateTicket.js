import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTicket = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || title.trim().length === 0) {
            setError("Title is required");
            return;
        }
        if (title.trim().length < 3) {
            setError("Title must be at least 3 characters");
            return;
        }
        
        try {
            await axios.post("http://127.0.0.1:8000/tickets", {
                title,
                description
            });
            alert("Ticket created");
            navigate("/");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                const detail = err.response.data.detail;
                setError(Array.isArray(detail) ? detail[0].msg : "Validation Error");
            } else {
                setError("Failed to create ticket");
            }
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary btn-sm mb-2" onClick={() => navigate(-1)}><i className="fas fa-arrow-left"></i></button>
            <h5><strong>Create Ticket</strong></h5>
            <hr/>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Title</label>
                    <input className={`form-control ${error ? "is-invalid" : ""}`} value={title} onChange={(e)=>setTitle(e.target.value)} />
                    {error && (
                    <div className="invalid-feedback">{error}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea className="form-control" value={description} onChange={(e)=>setDescription(e.target.value)} />
                </div>
                <button className="btn btn-success">Save Ticket</button>
            </form>
        </div>
    );
};

export default CreateTicket;