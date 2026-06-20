import {createSlice,  createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMeeting = createAsyncThunk(
    "user/fetchMeeting",
    async  () => {
        const response = await axios.get("/api/current-meeting/");
        console.log(response.data);
        return response.data;
    }
)

const initialState = {
    meetingID: null,
    loading: false,
    error: null,
};

export const meetingSlice = createSlice({
    name: "meeting",
    initialState,
    reducers: {
        setMeetingID: (state, action) => {
            state.meetingID = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMeeting.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchMeeting.fulfilled, (state, action) => {
            state.loading = false;
            state.meetingID = action.payload.id;
        });
        builder.addCase(fetchMeeting.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const {setMeetingID } = meetingSlice.actions;

export default meetingSlice.reducer;

