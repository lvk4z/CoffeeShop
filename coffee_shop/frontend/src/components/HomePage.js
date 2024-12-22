import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import OrdersPage from "./OrdersPage";
import RegisterPage from "./RegisterPage";
import CreateMeetingPage from "./CreateMeetingPage";
import Meeting from "./Meeting";
import Navbar from "./Navbar";
import { Grid2, Button, ButtonGroup, Typography } from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { setCoffeeName } from "../redux/features/userSlice"; 
import { fetchMeeting } from "../redux/features/userSlice"; 


const HomePage = () => {
  const dispatch = useDispatch();
  const coffee_name = useSelector((state) => state.user.coffeeName);
  const meetingID = useSelector((state) => state.user.meetingID);
  
  useEffect(() => {
    dispatch(fetchMeeting());
  },[dispatch]);

  useEffect(() => {
    fetch("/api/user-in-base")
      .then((response) => response.json())
      .then((data) => {
        dispatch(setCoffeeName(data.coffee_name));
        
        console.log(data.coffee_name);
      });
  }, [dispatch, coffee_name]);

  const renderHomePage = () => {
    if (coffee_name != null) {
      return <Navigate to={`/meeting/${meetingID}`} replace={false} />;
    } else {
      return (
        <Grid2 container spacing={2} align="center" sx={{
          marginTop: "64px",
        }}>
          <Grid2 item xs={12} align="center">
            <Typography variant="h3" >
              Coffee shop {meetingID}
            </Typography>
          </Grid2>
          <Grid2 item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/register" component={Link}>
                Enter 
              </Button>
            </ButtonGroup>
          </Grid2>
        </Grid2>
      );
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={renderHomePage()} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/create" element={<CreateMeetingPage />} />
        <Route path="/meeting/:meetingID" element={<Meeting />} />
      </Routes>
    </Router>
  );
};

export default HomePage;
