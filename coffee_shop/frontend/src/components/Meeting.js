import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button ,Typography, Grid } from "@material-ui/core";

const Meeting = () => {
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
          date: data.event_date,
          status: data.status,
          host: data.host,
        });
      });
  }, [meetingID]);

  return (
    <div>
      <h3>{meetingID}</h3>
      <p>Date: {meetingDetails.date}</p>
      <p>Status: {meetingDetails.status}</p>
      <p>Host: {meetingDetails.host}</p>
    </div>
  );
};

export default Meeting;
