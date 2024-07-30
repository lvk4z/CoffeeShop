import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
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
  Collapse,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const CreateMeetingPage = ({
  pUpdate = false,
  pDate,
  pStatus,
  pHost,
  pUpdateCallback,
  pID,
}) => {
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
  const [status, setStatus] = useState(pStatus);
  const [host, setHost] = useState(pHost ? pHost : getHost());
  const [menu, setMenu] = useState(3)
  const [errorMsg, setErrorMsg] = useState(" ");
  const [succesMsg, setSuccesMsg] = useState(" ");

  useEffect(() => {
    if (pUpdate && pUpdateCallback) {
      pUpdateCallback({ date, status, host });
    }
  }, [pDate, pStatus, pHost, pUpdate, pUpdateCallback]);

  const handleCreateClicked = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_date: date,
        host: host,
        status: status,
        menu: 3,
      }),
    };
    console.log(requestOptions);
    fetch("api/create-meeting", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/meeting/" + data.id));
  };

  const handleUpdateClicked = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_date: date,
        host: host,
        menu: 3,
        id: 5,
      }),
    };
    fetch("http://127.0.0.1:8000/api/update-meeting", requestOptions).then(
      (response) => {
        if (response.ok) {
          setSuccesMsg("Meeting updated succesfully!");
        } else {
          setErrorMsg("Update failed");
        }
      }
    );
    pUpdateCallback();
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleHostChange = (event) => {
    setHost(event.target.value);
  };

  const title = pUpdate ? "Update Meeting" : "Create a meeting";

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
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

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateClicked}
        >
          Update
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Collapse in={errorMsg != " " || succesMsg != " "}>
          {succesMsg != " " ? (
            <Alert severity="success" onClose={() => setSuccesMsg(" ")}>
              {succesMsg};
            </Alert>
          ) : (
            <Alert severity="error" onClose={() => setErrorMsg(" ")}>
              {errorMsg};
            </Alert>
          )}
          ;
        </Collapse>
      </Grid>
      <Grid item xs={12}>
        <Typography component="h4" variant="h4" align="center">
          {title}
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
      {pUpdate ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};

export default CreateMeetingPage;
