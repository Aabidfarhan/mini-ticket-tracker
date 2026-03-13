import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {

        axios.get(`http://127.0.0.1:8000/tickets/${id}`).then(res => {
            setTitle(res.data.title);
            setDescription(res.data.description);
            setStatus(res.data.status);
        }).catch(err => {
            if (err.response && err.response.status === 404) {
                navigate("/404");
            }
        });
    }, [id]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        
        await axios.patch(`http://localhost:8000/tickets/${id}`, {
            description,
            status
        });

        alert("Ticket updated");
        navigate("/");
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary btn-sm mb-2" onClick={() => navigate(-1)}><i className="fas fa-arrow-left"></i></button>
            <h5><strong>Edit Ticket</strong></h5>
            <hr/>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Title</label>
                    <input className="form-control" value={title} disabled />
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea className="form-control" value={description} onChange={(e)=>setDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Status</label>
                    <select className="form-control" value={status} onChange={(e)=>setStatus(e.target.value)}>
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </select>
                </div>
                <button className="btn btn-primary">Update Ticket</button>
            </form>
        </div>
    );
};

export default EditTicket;