import Drink from "./Drink";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Container, CircularProgress, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MenuDiv = () => {
  const meetingID = useSelector((state) => state.user.meetingID);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (meetingID) {
      fetch("/api/get-menu?id=" + meetingID)
        .then((response) => response.json())
        .then((data) => {
          setDrinks(data);
          setLoading(false);
        });
    } else {
      console.error("meetingID is null");
      setLoading(false);
    }
  }, [meetingID]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5" align="center" component="div">
        <Grid container spacing={3}>
          {drinks.map((item) => (
            <Grid item  key={item.name}>
              <Drink item={item} />
            </Grid>
          ))}
        </Grid>
      </Typography>
    </Container>
  );
};

export default MenuDiv;
