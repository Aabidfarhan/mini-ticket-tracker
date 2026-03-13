import axios from "axios";

const API_URL = "http://localhost:8000";

export const fetchTickets = async (params) => {
  const response = await axios.get(`${API_URL}/tickets`,{params});
  return response.data;
};