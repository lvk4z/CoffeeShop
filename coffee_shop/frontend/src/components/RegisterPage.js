import React, { useState } from "react";
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

const RegisterPage = () => {
  const defaultValue = "";
  const defaultHouse = "Z";
  const navigate = useNavigate();

  const [name, setName] = useState(defaultValue);
  const [error, setError] = useState(defaultValue);
  const [house, setHouse] = useState(defaultHouse);

  const handleTextFieldChange = (event) => {
    setName(event.target.value);
  };

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
            navigate("/", { replace: true });
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
          Register here
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
          <InputLabel id="house-label">Choose your house</InputLabel>
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
          Sign in
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" to="/" component={Link}>
          As a guest
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
