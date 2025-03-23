import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { fetchMeeting } from "../redux/features/userSlice"; 

const RegisterPage = () => {
  const defaultValue = "";
  const defaultHouse = "Z";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const meetingID = useSelector((state) => state.user.meetingID);

  const [name, setName] = useState(defaultValue);
  const [error, setError] = useState(defaultValue);
  const [house, setHouse] = useState(defaultHouse);

  const handleTextFieldChange = (event) => {
    setName(event.target.value);
  };

  useEffect(() => {
      dispatch(fetchMeeting());
    },[dispatch]);

  const signInClicked = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coname: name,
        house: house,
      }),
    };
    fetch("/api/register-as-member", requestOptions)
      .then(async (response) => {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          console.log(data);
          if (response.ok) {
            navigate(`/meeting/${meetingID}`, { replace: true });
            window.location.reload();
          } else {
            setError(data.error || "Registration failed");
          }
        } catch (err) {
          console.error("Failed to parse response as JSON:", text);
          setError("Registration failed: Invalid server response");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Registration failed: Network error");
      });
  };

  const handleHouseChange = (event) => {
    setHouse(event.target.value);
  };

  return (
    <Grid container spacing={2} align="center">
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          Zapisz się tutaj
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={Boolean(error)}
          label="Enter name"
          placeholder="name"
          value={name}
          helperText={error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <InputLabel id="house-label">Wybierz rodzinę</InputLabel>
          <Select
            labelId="house-label"
            id="house"
            value={house}
            onChange={handleHouseChange}
          >
            <MenuItem value="M">Miczkowie</MenuItem>
            <MenuItem value="Z">Zegarowie</MenuItem>
            <MenuItem value="S">Staszkowie</MenuItem>
            <MenuItem value="K">Krakowscy</MenuItem>
          </Select>
          <FormHelperText>{error}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={signInClicked}>
          Zapisz się
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" to="/" component={Link}>
          Wejdź jako gość
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Cofnij
        </Button>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;