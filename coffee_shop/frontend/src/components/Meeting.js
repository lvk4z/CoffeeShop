import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
const Meeting = () => {
  const navigate = useNavigate();
  const { meetingID } = useParams();
  const [meetingDetails, setMeetingDetails] = useState({
    date: "01-01-2001",
    status: "request",
    host: "bad",
  });

  useEffect(() => {
    fetch("/api/get-meeting?id=" + meetingID)
      .then((response) => response.json())
      .then((data) => {
        setMeetingDetails({
          date: data.event_date.slice(0, 10),
          status: data.status,
          host: data.host,
        });
      });
  }, [meetingID]);

  const leaveButtonPressed = (event) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-meeting", requestOptions).then(async (response) => {
      if (response.ok) {
        navigate("/");
      } else {
        setError(data.error || "Registration failed");
      }
    });
  };

  return (
    <Grid container spacing={2} align="center">
      <Grid item xs="12">
        <Typography variant="h4" component="h4">
          Data: {meetingDetails.date}
        </Typography>
      </Grid>
      <Grid item xs="12">
        <Typography variant="h6" component="h6">
          Status: {meetingDetails.status}
        </Typography>
      </Grid>
      <Grid item xs="12">
        <Typography variant="h6" component="h6">
          Host: {meetingDetails.host}
        </Typography>
      </Grid>
      <Grid item xs="12">
        <Button variant="contained" color="primary" onClick={leaveButtonPressed}>
          Erase Yourself
        </Button>
      </Grid>
    </Grid>
  );
};

export default Meeting;

/*
<div>
      <h3>{meetingID}</h3>
      <p>Date: {meetingDetails.date}</p>
      <p>Status: {meetingDetails.status}</p>
      <p>Host: {meetingDetails.host}</p>
    </div>
  */
