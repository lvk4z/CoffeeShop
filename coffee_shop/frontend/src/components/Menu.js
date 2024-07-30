import Drink from "./Drink";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Container, CircularProgress, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const MenuDiv = ({ ID }) => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(ID)
    fetch("/api/get-menu?id=" + ID)
      .then((response) => response.json())
      .then((data) => {
        setDrinks(data);
        setLoading(false);
      });
  }, []);
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
