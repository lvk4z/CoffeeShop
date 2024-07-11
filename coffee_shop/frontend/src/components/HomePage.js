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
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";

const HomePage = () => {
  const [coffeeName, setCoffeeName] = useState(null);

  useEffect(() => {
    fetch("/api/user-in-base")
      .then((response) => response.json())
      .then((data) => {
        setCoffeeName(data.coffee_name);
        console.log(data);
      });
  }, []);

  const renderHomePage = () => {
    if (coffeeName) {
      return <Navigate to={`/meeting/5`} replace={true} />;
    } else {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <Typography variant="h3" compact="h3">
              House Party
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/join" component={Link}>
                Join a Room
              </Button>
              <Button color="secondary" to="/create" component={Link}>
                Create a Room
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      );
    }
  };

  return (
    <Router>
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
