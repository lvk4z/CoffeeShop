import Drink from "./Drink";
import React, { useState, useEffect } from "react";
import { Typography, Container, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeeting } from "../redux/features/userSlice";

const MenuDiv = () => {
  const dispatch = useDispatch();
  const meetingID = useSelector((state) => state.user.meetingID);
  const [drinks, setDrinks] = useState([]);
  const loading = useSelector((state) => state.user.loading);


  useEffect(() => {
    if (meetingID) {
      fetch("/api/get-menu?id=" + meetingID)
        .then((response) => response.json())
        .then((data) => {
          setDrinks(data);
          console.log("drinks", data);  
        });
    } else {
      console.log("meetingID is null");
    }
  }, [meetingID]);

  if (loading) {
    return (
      <Container align="center">
        <Typography variant="h4" align="center" gutterBottom>
          Menu
        </Typography>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Menu  
      </Typography>
      <Grid container spacing={5}>
        {drinks.map((drink) => (
          <Grid item={true} size={{ xs: 12, md: 3 }} key={drink.name}>
            <Drink item={drink} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MenuDiv;
