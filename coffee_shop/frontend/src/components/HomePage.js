import React, { useEffect } from "react";
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
import { Button, Typography, CircularProgress, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeeting } from "../redux/features/meetingSlice";
import { checkAuthStatus } from "../redux/features/authSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const meetingID = useSelector((state) => state.meeting.meetingID);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMeeting());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token && !isAuthenticated && !loading) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated, loading]);

  const renderHomePage = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }

    if (isAuthenticated && meetingID) {
      return <Navigate to={`/meeting/${meetingID}`} replace />;
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          py: 8,
          px: 2,
        }}
      >
        <Typography variant="h3" align="center" sx={{ fontWeight: 700 }}>
          Copijesz?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary">
          Aplikacja do zamawiania kawy na spotkania rodziny
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/register"
          sx={{ px: 5, py: 1.5, fontSize: "1.1rem" }}
        >
          Wejdź
        </Button>
      </Box>
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