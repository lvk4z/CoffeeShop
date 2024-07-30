import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Button,
  Typography,
  Grid,
} from "@material-ui/core";

const Drink = ({ item }) => {
  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          width="170"
          image={item.image}
          alt={item.name}
        />
        <CardContent>
          <Typography variant="h6" align="center" component="div">
            {item.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Drink;
