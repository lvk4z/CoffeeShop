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
import { useDispatch, useSelector } from "react-redux";
import { fetchMeeting } from "../redux/features/meetingSlice"; 
import { authenticateUser, clearError } from "../redux/features/authSlice";

const RegisterPage = () => {
  const defaultValue = "";
  const defaultHouse = "Z";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const meetingID = useSelector((state) => state.meeting.meetingID);
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState(defaultValue);
  const [house, setHouse] = useState(defaultHouse);
  const [localError, setLocalError] = useState(defaultValue);

  useEffect(() => {
    dispatch(fetchMeeting());
  }, [dispatch]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setName(savedUsername);
    }
  }, []);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && meetingID) {
      navigate(`/meeting/${meetingID}`, { replace: true });
    }
  }, [isAuthenticated, meetingID, navigate]);

  const handleTextFieldChange = (event) => {
    setName(event.target.value);
    setLocalError(""); 
    if (error) {
      dispatch(clearError());
    }
  };

  const handleHouseChange = (event) => {
    setHouse(event.target.value);
  };

  const handleAuthenticateUser = async () => {
    if (!name.trim()) {
      setLocalError("Wpisz swoje imię");
      return;
    }

    try {
      setLocalError("");
      
      // Wywołaj akcję autentykacji
      const result = await dispatch(authenticateUser({ 
        username: name.trim(), 
        coffee_group: house 
      })).unwrap();
      
      // Jeśli sukces, przekieruj (useEffect wykona redirect)
      console.log("Authentication successful:", result);
      console.log(isAuthenticated);
      if (isAuthenticated) {
        navigate(`/meeting/${meetingID}`, { replace: true });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setLocalError(error || "Błąd podczas logowania. Spróbuj ponownie.");
    }
  };

  const displayError = localError || error || "";

  return (
    <Grid container spacing={2} align="center">
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          Wejdź do aplikacji
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={Boolean(displayError)}
          label="Wpisz swoje imię"
          placeholder="Imię"
          value={name}
          helperText={displayError}
          variant="outlined"
          onChange={handleTextFieldChange}
          disabled={loading}
          fullWidth
          style={{ maxWidth: 300 }}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset" style={{ minWidth: 200 }}>
          <InputLabel id="house-label">Wybierz rodzinę</InputLabel>
          <Select
            labelId="house-label"
            id="house"
            value={house}
            onChange={handleHouseChange}
            disabled={loading}
          >
            <MenuItem value="M">Miczkowie</MenuItem>
            <MenuItem value="Z">Zegarowie</MenuItem>
            <MenuItem value="S">Staszkowie</MenuItem>
            <MenuItem value="K">Krakowscy</MenuItem>
          </Select>
          {displayError && <FormHelperText error>{displayError}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAuthenticateUser}
          disabled={loading}
        >
          {loading ? "Logowanie..." : "Wejdź"}
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