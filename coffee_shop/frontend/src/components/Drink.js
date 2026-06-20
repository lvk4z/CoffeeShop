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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import axiosInstance from "../utils/axiosInstance";

const Drink = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ordered, setOrdered] = useState(false);

  const handleClose = () => {
    setQuantity(1);
    setOrdered(false);
    setOpen(false);
  };

  const handleOrder = () => {
    axiosInstance
      .post("/create-order/", { drink_name: item.name, quantity })
      .then(() => setOrdered(true))
      .catch((err) => console.error("Order failed:", err));
  };

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardActionArea onClick={() => setOpen(true)} sx={{ flexGrow: 1 }}>
          {item.image ? (
            <CardMedia component="img" height="160" image={item.image} alt={item.name} />
          ) : (
            <Box
              sx={{
                height: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(201,87,42,0.08)",
              }}
            >
              <LocalCafeOutlinedIcon sx={{ fontSize: 56, color: "primary.main", opacity: 0.6 }} />
            </Box>
          )}
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} align="center">
              {item.name}
            </Typography>
            {item.description && item.description.trim() && (
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                {item.description}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 360 },
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(15,14,13,0.2)",
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              {item.name}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {item.description && item.description.trim() && (
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          )}

          {ordered ? (
            <Box sx={{ textAlign: "center", py: 1 }}>
              <Typography variant="h6" color="success.main" fontWeight={600}>
                ✓ Zamówiono!
              </Typography>
              <Button variant="text" onClick={handleClose} sx={{ mt: 1, color: "text.secondary" }}>
                Zamknij
              </Button>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  py: 0.5,
                }}
              >
                <IconButton
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography variant="h5" fontWeight={600} sx={{ minWidth: 32, textAlign: "center" }}>
                  {quantity}
                </Typography>
                <IconButton
                  onClick={() => setQuantity((q) => q + 1)}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Button variant="contained" color="primary" onClick={handleOrder} fullWidth sx={{ py: 1.2 }}>
                Zamów {quantity > 1 ? `(×${quantity})` : ""}
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Drink;

