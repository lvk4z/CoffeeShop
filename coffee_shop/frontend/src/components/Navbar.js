import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import NextMeetingInfo from "./NextMeetingInfo";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/authSlice";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMobileOpen(false);
  };

  const handleOrders = () => {
    navigate("/orders");
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box
        sx={{
          px: 3,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(232,228,218,0.12)",
          minHeight: 60,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          letterSpacing="-0.02em"
          sx={{ color: "var(--code-text)", cursor: "pointer" }}
          onClick={() => { navigate("/"); setMobileOpen(false); }}
        >
          ☕ Copijesz
        </Typography>
      </Box>

      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(232,228,218,0.08)" }}>
        <NextMeetingInfo />
      </Box>

      <List sx={{ pt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleOrders} sx={{ px: 3, py: 1.5 }}>
            <ShoppingBagOutlinedIcon sx={{ mr: 1.5, color: "var(--muted)", fontSize: 20 }} />
            <ListItemText
              primary="Zamówienia"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
            />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ borderColor: "rgba(232,228,218,0.1)", mx: 2, my: 0.5 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ px: 3, py: 1.5 }}>
            <ExitToAppOutlinedIcon sx={{ mr: 1.5, color: "var(--accent)", fontSize: 20 }} />
            <ListItemText
              primary="Wyloguj"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--accent)" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "rgba(26,25,23,0.97)",
          borderBottom: "1px solid rgba(232,228,218,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 60, sm: 64, md: 68 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Mobile: hamburger */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            fontWeight={800}
            letterSpacing="-0.02em"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              color: "var(--code-text)",
              whiteSpace: "nowrap",
              transition: "color 0.15s",
              "&:hover": { color: "#fff" },
              mr: { xs: "auto", sm: 0 },
            }}
          >
            ☕ Copijesz
          </Typography>

          {/* Separator */}
          <Box
            sx={{
              width: "1px",
              height: 22,
              bgcolor: "rgba(232,228,218,0.18)",
              mx: { sm: 2, md: 3 },
              flexShrink: 0,
              display: { xs: "none", sm: "block" },
            }}
          />

          {/* Countdown — grows to fill remaining space */}
          <Box sx={{ flex: 1, display: { xs: "none", sm: "flex" }, alignItems: "center", overflow: "hidden", mr: 1 }}>
            <NextMeetingInfo />
          </Box>

          {/* Mobile: quick orders icon */}
          <IconButton
            onClick={handleOrders}
            sx={{ display: { xs: "flex", sm: "none" }, color: "var(--code-text)", opacity: 0.85 }}
          >
            <ShoppingBagOutlinedIcon />
          </IconButton>

          {/* Tablet (sm < md): icon-only buttons */}
          <Box sx={{ display: { xs: "none", sm: "flex", md: "none" }, alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Zamówienia" placement="bottom">
              <IconButton
                onClick={handleOrders}
                sx={{ color: "var(--code-text)", opacity: 0.8, "&:hover": { opacity: 1, bgcolor: "rgba(232,228,218,0.08)" } }}
              >
                <ShoppingBagOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Wyloguj" placement="bottom">
              <IconButton
                onClick={handleLogout}
                sx={{ color: "var(--accent)", "&:hover": { bgcolor: "rgba(201,87,42,0.12)" } }}
              >
                <ExitToAppOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Desktop (md+): text + icon buttons */}
          <Box sx={{ display: { xs: "none", sm: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
            <Button
              onClick={handleOrders}
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{ color: "var(--code-text)", opacity: 0.85, "&:hover": { opacity: 1, bgcolor: "rgba(232,228,218,0.08)" } }}
            >
              Zamówienia
            </Button>
            <Button
              onClick={handleLogout}
              startIcon={<ExitToAppOutlinedIcon />}
              sx={{ color: "var(--accent)", "&:hover": { bgcolor: "rgba(201,87,42,0.12)" } }}
            >
              Wyloguj
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;


