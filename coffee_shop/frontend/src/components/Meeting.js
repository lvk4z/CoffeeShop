import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import CreateMeetingPage from "./CreateMeetingPage";

const Meeting = () => {
  const navigate = useNavigate();
  const { meetingID } = useParams();
  const [meetingDetails, setMeetingDetails] = useState({
    date: "01-01-2001",
    status: "request",
    host: "bad",
  });
  const [showSettings, setShowSettings] = useState(false);

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
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => updateShowSettings(true)}
        >
          settings
        </Button>
      </Grid>
    );
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateMeetingPage
            pUpdate={true}
            pDate={meetingDetails.date}
            pStatus={meetingDetails.status}
            pHost={meetingDetails.host}
            pUpdateCallback={() => {}}
            pID={meetingID}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} alignItems="center" direction="column">
      {showSettings ? (
        renderSettings()
      ) : (
        <>
          <Grid item xs={12}>
            <Typography variant="h2" component="h2">
              ID: {meetingID}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h4">
              Data: {meetingDetails.date}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h6">
              Status: {meetingDetails.status}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h6">
              Host: {meetingDetails.host}
            </Typography>
          </Grid>
          {meetingDetails.host === "S" ? renderSettingsButton() : null}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={leaveButtonPressed}
            >
              Erase Yourself
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Meeting;