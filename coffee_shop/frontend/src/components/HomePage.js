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
import { Button, ButtonGroup, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useDispatch, useSelector} from "react-redux";
import { setCoffeeName, setHouse } from "../redux/features/userSlice"; 
import { fetchMeeting } from "../redux/features/userSlice"; 


const HomePage = () => {
  const dispatch = useDispatch();
  const coname = useSelector((state) => state.user.coffeeName);
  const hosue = useSelector((state) => state.user.house )
  const meetingID = useSelector((state) => state.user.meetingID);
  
  useEffect(() => {
    dispatch(fetchMeeting());
  },[dispatch]);

  useEffect(() => {
    fetch("/api/user-in-base")
      .then((response) => response.json())
      .then((data) => {
        dispatch(setCoffeeName(data.coname));
        dispatch(setHouse(data.house));
      });
  }, [dispatch, coname]);

  const renderHomePage = () => {
    if (coname) {
      return <Navigate to={`/meeting/${meetingID}`} replace={false} />;
    } else {
      return (
        <Grid container spacing={2}>
          <Grid item size={12}>
            <Typography variant="h3" align="center">
              Witaj w aplikacji do zamawania kawy!
            </Typography>
          </Grid>
          <Grid item size={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/register" component={Link}>
                Wejdź
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
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
