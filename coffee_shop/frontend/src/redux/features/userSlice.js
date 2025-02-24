import {createSlice,  createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMeeting = createAsyncThunk(
    "user/fetchMeeting",
    async  () => {
        const response = await axios.get("/api/current-meeting");
        console.log(response.data);
        console.log("w reducerze");
        return response.data;
    }

)

const initialState = {
    meetingID: null,
    coffeeName: "",
    house:"",
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setMeetingID: (state, action) => {
            state.meetingID = action.payload;
        },
        setCoffeeName: (state, action) => {
            state.coffeeName = action.payload;
        },
        setHouse: (state, action) => {
            state.house = action.payload
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
            console.log("inUserSlice","ustalnoe meetingID", action.payload.id); 
        });
        builder.addCase(fetchMeeting.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const {setMeetingID, setCoffeeName, setHouse} = userSlice.actions;

export default userSlice.reducer;

