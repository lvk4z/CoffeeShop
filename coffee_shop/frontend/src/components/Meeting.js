import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CreateMeetingPage from "./CreateMeetingPage";
import Menu from "./Menu";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeeting } from "../redux/features/userSlice";

const Meeting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meetingID = useSelector((state) => state.user.meetingID);
  const [meetingDetails, setMeetingDetails] = useState({
    date: "01-01-2001",
    status: "request",
    host: "bad",
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    dispatch(fetchMeeting());
  }, [dispatch]);

  useEffect(() => {
    if (meetingID) {
      console.log("fetching meeting details", meetingID);
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
        window.location.reload();
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
      <Grid item size={12} >
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
        <Grid item size={12}>
          <CreateMeetingPage
            pUpdate={true}
            pDate={meetingDetails.date}
            pStatus={meetingDetails.status}
            pHost={meetingDetails.host}
            pUpdateCallback={() => {}}
            pID={meetingID}
          />
        </Grid>
        <Grid item size={12}>
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
          <Grid item size={12}>
            <Menu />
          </Grid>
          <Grid item size={12}>
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
