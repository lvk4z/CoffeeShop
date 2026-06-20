import Drink from "./Drink";
import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";

const Menu = () => {
  const meetingID = useSelector((state) => state.meeting.meetingID);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meetingID) {
      setLoading(true);
      axiosInstance
        .get(`/get-menu/?id=${meetingID}`)
        .then((res) => setDrinks(res.data))
        .catch((err) => console.error("Error fetching menu:", err))
        .finally(() => setLoading(false));
    }
  }, [meetingID]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography color="text.secondary">Ładowanie menu…</Typography>
      </Box>
    );
  }

  if (!drinks.length) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="text.secondary">Brak napojów w menu</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h5" fontWeight={700} mb={3} align="center">
        Menu
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {drinks.map((drink) => (
          <Grid key={drink.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Drink item={drink} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Menu;

