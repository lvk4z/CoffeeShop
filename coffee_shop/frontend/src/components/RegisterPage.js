import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeeting } from "../redux/features/meetingSlice";
import { authenticateUser, clearError } from "../redux/features/authSlice";

const HOUSES = [
  { value: "M", label: "Miczki", address: "nr 17f", emoji: "🏠" },
  { value: "Z", label: "Zegarowie", address: "nr 17", emoji: "🏡" },
  { value: "S", label: "Staszkowie", address: "nr 17a", emoji: "🏘️" },
  { value: "K", label: "Krakowscy", address: "nr 136a", emoji: "🏗️" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const meetingID = useSelector((state) => state.meeting.meetingID);
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [house, setHouse] = useState("Z");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(fetchMeeting());
    dispatch(clearError());
    const saved = localStorage.getItem("username");
    if (saved) setName(saved);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && meetingID) {
      navigate(`/meeting/${meetingID}`, { replace: true });
    }
  }, [isAuthenticated, meetingID, navigate]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setLocalError("Wpisz swoje imię");
      return;
    }
    setLocalError("");
    try {
      await dispatch(authenticateUser({ username: name.trim(), house })).unwrap();
    } catch (err) {
      setLocalError(err || "Błąd logowania");
    }
  };

  const displayError = localError || error || "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
        pt: "64px",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={0.5} align="center">
          Wejdź do aplikacji
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={4}>
          Wpisz swoje imię i wybierz dom
        </Typography>

        <TextField
          fullWidth
          label="Twoje imię"
          variant="outlined"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setLocalError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          sx={{ mb: 3 }}
          autoFocus
        />

        <Typography variant="body2" color="text.secondary" mb={1.5} fontWeight={600}>
          Twój dom
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
          {HOUSES.map((h) => (
            <Box
              key={h.value}
              onClick={() => setHouse(h.value)}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "2px solid",
                borderColor: house === h.value ? "primary.main" : "divider",
                backgroundColor: house === h.value ? "rgba(201,87,42,0.08)" : "background.paper",
                cursor: "pointer",
                transition: "all 0.15s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "rgba(201,87,42,0.05)",
                },
              }}
            >
              <Typography variant="h5" mb={0.5}>{h.emoji}</Typography>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                {h.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {h.address}
              </Typography>
            </Box>
          ))}
        </Box>

        {displayError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {displayError}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Wejdź"}
        </Button>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
