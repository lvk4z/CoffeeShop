import React, { useState, useEffect } from "react";
import { Button, Typography, Grid2 } from "@mui/material"
import { useNavigate } from "react-router-dom";
import CreateMeetingPage from "./CreateMeetingPage";
import Menu from "./Menu";
import { useSelector } from "react-redux";

const Meeting = () => {
  const navigate = useNavigate();
  const meetingID = useSelector((state) => state.user.meetingID);
  const [meetingDetails, setMeetingDetails] = useState({
    date: "01-01-2001",
    status: "request",
    host: "bad",
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (meetingID) {
      fetch("/api/get-meeting?id=" + meetingID)
        .then((response) => response.json())
        .then((data) => {
          setMeetingDetails({
            date: data.event_date.slice(0, 10),
            status: data.status,
            host: data.host,
          });
        })
        .catch((error) => {
          console.error("Error fetching meeting details:", error);
        });
    }
  }, [meetingID]);

  const leaveButtonPressed = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-meeting", requestOptions).then((response) => {
      if (response.ok) {
        navigate("/");
      } else {
        setError(data.error || "Registration failed");
      }
    });
  };

  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  const renderSettingsButton = () => {
    return (
      <Grid2 item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => updateShowSettings(true)}
        >
          settings
        </Button>
      </Grid2>
    );
  };

  const renderSettings = () => {
    return (
      <Grid2 container spacing={1}>
        <Grid2 item xs={12} align="center">
          <CreateMeetingPage
            pUpdate={true}
            pDate={meetingDetails.date}
            pStatus={meetingDetails.status}
            pHost={meetingDetails.host}
            pUpdateCallback={() => {}}
            pID={meetingID}
          />
        </Grid2>
        <Grid2 item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid2>
      </Grid2>
    );
  };

  return (
    <Grid2 container spacing={2} alignItems="center" direction="column">
      {showSettings ? (
        renderSettings()
      ) : (
        <>
          <Grid2 item xs={12}>
            <Typography variant="h2" component="h2">
              ID: {meetingID}
            </Typography>
            <Menu />
          </Grid2>
          <Grid2 item xs={12}>
            <Typography variant="h4" component="h4">
              Data: {meetingDetails.date}
            </Typography>
          </Grid2>
          <Grid2 item xs={12}>
            <Typography variant="h6" component="h6">
              Status: {meetingDetails.status}
            </Typography>
          </Grid2>
          <Grid2 item xs={12}>
            <Typography variant="h6" component="h6">
              Host: {meetingDetails.host}
            </Typography>
          </Grid2>
          {meetingDetails.host === "S" ? renderSettingsButton() : null}
          <Grid2 item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={leaveButtonPressed}
            >
              Erase Yourself
            </Button>
          </Grid2>
        </>
      )}
    </Grid2>
  );
};

export default Meeting;