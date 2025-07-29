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
import { useDispatch, useSelector } from "react-redux";
import { fetchMeeting } from "../redux/features/meetingSlice"; 
import { authenticateUser, checkAuthStatus } from "../redux/features/authSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const meetingID = useSelector((state) => state.meeting.meetingID);
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMeeting());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    console.log("Checking auth status with token:", token);
    if (token && !isAuthenticated) {
      console.log("Found token in localStorage, checking status...");
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated, loading]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("access");
    
    if (savedUsername && !token && !isAuthenticated && !loading) {
      console.log("Auto-login attempt for:", savedUsername);
      dispatch(authenticateUser({ username: savedUsername }));
    }
  }, [dispatch, isAuthenticated, loading]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated with JWT:", user);
      dispatch(setCoffeeName(user.username));
      dispatch(setHouse(user.house || 'Z'));
    } else if (!isAuthenticated) {
      fetch("/api/user-in-base/")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('User not found');
        })
        .then((data) => {
          dispatch(setCoffeeName(data.coname || data.username));
          dispatch(setHouse(data.house));
        })
        .catch((error) => {
          console.log("User not found in old system:", error);
        });
    }
  }, [dispatch, isAuthenticated, user]);

  const renderHomePage = () => {
    if (loading) {
      return (
        <Grid container spacing={2}>
          <Grid item size={12}>
            <Typography variant="h5" align="center">
              Ładowanie...
            </Typography>
          </Grid>
        </Grid>
      );
    }

    if (isAuthenticated) {
      return <Navigate to={`/meeting/${meetingID}`} replace={true} />;
    } 
    
    return (
      <Grid container spacing={2}>
        <Grid item size={12}>
          <Typography variant="h3" align="center">
            Witaj w aplikacji do zamawania kawy!
          </Typography>
        </Grid>
        {isAuthenticated && user && (
          <Grid item size={12}>
            <Typography variant="h6" align="center" color="primary">
              Zalogowany jako: {user.username} ({user.coffee_group})
            </Typography>
          </Grid>
        )}
        <Grid item size={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/register" component={Link}>
              {isAuthenticated ? "Przejdź dalej" : "Wejdź"}
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
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