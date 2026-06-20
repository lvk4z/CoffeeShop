import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { getHost, getNextSunday } from "../utils/utils";
import axiosInstance from "../utils/axiosInstance";

const CreateMeetingPage = ({
  pUpdate = false,
  pDate,
  pStatus,
  pHost,
  pUpdateCallback,
  pID,
}) => {
  const navigate = useNavigate();

  const [date, setDate] = useState(pDate || getNextSunday(true));
  const [status, setStatus] = useState(pStatus || "PL");
  const [host, setHost] = useState(pHost || getHost());
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreate = () => {
    axiosInstance
      .post("/create-meeting/", { event_date: date, host, status })
      .then((res) => navigate("/meeting/" + res.data.id))
      .catch(() => setErrorMsg("Nie udało się utworzyć spotkania"));
  };

  const handleUpdate = () => {
    axiosInstance
      .patch("/update-meeting/", { event_date: date, host, id: pID })
      .then(() => {
        setSuccessMsg("Spotkanie zaktualizowane!");
        if (pUpdateCallback) pUpdateCallback();
      })
      .catch(() => setErrorMsg("Aktualizacja nie powiodła się"));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
        maxWidth: 480,
        mx: "auto",
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={3} align="center">
        {pUpdate ? "Edytuj spotkanie" : "Utwórz spotkanie"}
      </Typography>

      {errorMsg && (
        <Alert severity="error" onClose={() => setErrorMsg("")} sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" onClose={() => setSuccessMsg("")} sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <TextField
          label="Data i godzina"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="host-label">Gospodarz</InputLabel>
          <Select
            labelId="host-label"
            value={host}
            label="Gospodarz"
            onChange={(e) => setHost(e.target.value)}
          >
            <MenuItem value="M">Miczki – nr 17f</MenuItem>
            <MenuItem value="Z">Zegarowie – nr 17</MenuItem>
            <MenuItem value="S">Staszkowie – nr 17a</MenuItem>
            <MenuItem value="K">Krakowscy – nr 136a</MenuItem>
          </Select>
        </FormControl>

        {pUpdate && (
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="PL">Zaplanowane</MenuItem>
              <MenuItem value="PO">Przełożone</MenuItem>
              <MenuItem value="TP">Odbyło się</MenuItem>
            </Select>
          </FormControl>
        )}

        {pUpdate ? (
          <Button variant="contained" color="primary" onClick={handleUpdate} fullWidth sx={{ py: 1.3 }}>
            Zapisz zmiany
          </Button>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={handleCreate} fullWidth sx={{ py: 1.3 }}>
              Utwórz spotkanie
            </Button>
            <Button variant="text" component={Link} to="/" sx={{ color: "text.secondary" }}>
              Wróć
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default CreateMeetingPage;

