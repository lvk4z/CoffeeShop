import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import NextMeetingInfo from "./NextMeetingInfo";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const leaveButtonPressed = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-meeting", requestOptions).then((response) => {
      if (response.ok) {
        navigate("/");
        window.location.reload();
      } else {
        setError(data.error || "Registration failed");
      }
    });
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        <ListItem>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            KAWA
          </Typography>
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Zamówienia" />
        </ListItem>
        <ListItem button>
          <ListItemText
            primary={
              <>
                Wyjdź <ExitToAppOutlinedIcon />
              </>
            }
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
      position="fixed"
        sx={{
          backgroundColor: "#17191b !important",
          color: "white !important",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
            }}
          >
            KAWA
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" }
            }}
          >
            <NextMeetingInfo />
          </Typography>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Button color="inherit" onClick={() => navigate("/orders")}>
              Zamówienia
            </Button>
            <Button color="inherit" onClick={leaveButtonPressed}>
              Wyjdź <ExitToAppOutlinedIcon />
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
