import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Button,
  Typography,
  Modal,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const Drink = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setQuantity(1);
    setOpen(false);
  };

  const handleOrder = () => {
    console.log(`Ordered ${quantity} of ${item.name}`);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drink_name: item.name,
        quantity: quantity,
      }),
    
  };
    fetch("/api/create-order", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
    handleClose();
  };

   const increaseQuantity = () => {
     setQuantity((prev) => prev + 1);
   };

   const decreaseQuantity = () => {
     if (quantity > 1) {
       setQuantity((prev) => prev - 1);
     }
   };
  return (
    <>
      <Grid container justifyContent="center">
        <Card sx={{ width: 500 }}>
          <CardActionArea onClick={handleOpen}>
            <CardMedia
              component="img"
              height="140"
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
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {item.name}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {item.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 5,
            }}
          >
            <IconButton onClick={decreaseQuantity}>
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6">{quantity}</Typography>
            <IconButton onClick={increaseQuantity}>
              <AddIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOrder}
            fullWidth
          >
            Zamów
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Drink;
