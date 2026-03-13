import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTickets } from "./ticketAPI";

export const getTickets = createAsyncThunk(
  "tickets/getTickets",
  async (params) => {
    const data = await fetchTickets(params);
    return data;
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.status = "success";
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default ticketSlice.reducer;