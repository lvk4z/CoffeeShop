import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const CreateMeetingPage = () => {
  const defaultStatus = "PL";
  const navigate = useNavigate();

  const getNextSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    nextSunday.setHours(12, 0, 0, 0);
    return nextSunday.toISOString().split(".")[0];
  };

  const getHost = () => {
    const today = new Date();
    const week = today.getMonth();
    if (week % 4 === 0) {
      return "M";
    } else if (week % 4 === 1) {
      return "Z";
    } else if (week % 4 === 2) {
      return "S";
    } else {
      return "K";
    }
  };

  const [date, setDate] = useState(getNextSunday());
  const [status, setStatus] = useState(defaultStatus);
  const [host, setHost] = useState(getHost());

  const handleCreateClicked = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_date: date,
        host: host,
        status: status,
      }),
    };
    fetch("api/create-meeting", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/meeting/" + data.id));
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleHostChange = (event) => {
    setHost(event.target.value);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Typography component="h4" variant="h4" align="center">
          Create A Meeting
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>Choose a date for the meeting</FormHelperText>
          <TextField
            id="date"
            type="datetime-local"
            defaultValue={date}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleDateChange}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <InputLabel id="host-label">Host</InputLabel>
          <Select
            labelId="host-label"
            id="host"
            value={host}
            onChange={handleHostChange}
          >
            <MenuItem value="M">Miczkowie</MenuItem>
            <MenuItem value="Z">Zegarowie</MenuItem>
            <MenuItem value="S">Staszkowie</MenuItem>
            <MenuItem value="K">Krakowscy</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleCreateClicked}
        >
          Create
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateMeetingPage;
