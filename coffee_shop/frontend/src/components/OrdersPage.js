import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import axiosInstance from "../utils/axiosInstance";

const HOUSE_COLORS = {
  M: "#c9572a",
  Z: "#2a6fc9",
  S: "#2a9c57",
  K: "#7a4f2a",
  H: "#7a7670",
};

const HOUSE_NAMES = {
  M: "Miczki",
  Z: "Zegarowie",
  S: "Staszkowie",
  K: "Krakowscy",
};

function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

const OrdersPage = () => {
  const [myOrders, setMyOrders] = useState(new Map());
  const [myUserName, setMyUserName] = useState("");
  const [guestList, setGuestList] = useState(null); // null = not host
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = () => {
    axiosInstance.get("/get-guest-orders/")
      .then((res) => {
        setMyUserName(res.data.userName || "");
        const map = new Map();
        (res.data.orders || []).forEach((item) => {
          if (item.name) map.set(item.name, (map.get(item.name) || 0) + 1);
        });
        setMyOrders(new Map(map));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchAllOrders = () => {
    axiosInstance.get("/meeting-orders/")
      .then((res) => setGuestList(res.data.guests || []))
      .catch((err) => {
        if (err.response?.status === 403 || err.response?.status === 404) {
          setGuestList(null);
        }
      });
  };

  useEffect(() => {
    fetchMyOrders();
    fetchAllOrders();
  }, []);

  useInterval(() => {
    fetchMyOrders();
    fetchAllOrders();
  }, 10000);

  const toggleDone = (orderId) => {
    setGuestList((prev) =>
      prev.map((g) => ({
        ...g,
        orders: g.orders.map((o) =>
          o.id === orderId ? { ...o, done: !o.done } : o
        ),
      }))
    );
    axiosInstance.patch(`/toggle-order/${orderId}/`)
      .catch(() => {
        // Revert optimistic update on error
        setGuestList((prev) =>
          prev.map((g) => ({
            ...g,
            orders: g.orders.map((o) =>
              o.id === orderId ? { ...o, done: !o.done } : o
            ),
          }))
        );
      });
  };

  const myOrderEntries = Array.from(myOrders.entries());

  return (
    <Box sx={{ pt: { xs: "76px", sm: "84px", md: "92px" }, pb: 5, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ maxWidth: 640, mx: "auto" }}>

        {/* ── HOST PANEL ──────────────────────────────────── */}
        {guestList !== null && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Zamówienia na spotkanie
            </Typography>

            {loading && guestList.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : guestList.length === 0 ? (
              <Paper
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 4, textAlign: "center" }}
              >
                <LocalCafeOutlinedIcon sx={{ fontSize: 40, color: "text.secondary", opacity: 0.4, mb: 1 }} />
                <Typography color="text.secondary">Brak zamówień</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {guestList.map((g) => {
                  const doneCount = g.orders.filter((o) => o.done).length;
                  const total = g.orders.length;
                  const allDone = doneCount === total;
                  return (
                    <Paper
                      key={g.guest}
                      elevation={0}
                      sx={{ border: "1px solid", borderColor: allDone ? "success.light" : "divider", borderRadius: 3, overflow: "hidden", transition: "border-color 0.3s" }}
                    >
                      {/* Guest header */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          px: { xs: 2, sm: 2.5 },
                          py: 1.5,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          backgroundColor: "background.paper",
                          gap: 1.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: 15,
                            fontWeight: 700,
                            bgcolor: HOUSE_COLORS[g.house] || "#7a7670",
                            flexShrink: 0,
                          }}
                        >
                          {g.guest[0]?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700} noWrap>
                            {g.guest}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {HOUSE_NAMES[g.house] || g.house}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${doneCount}/${total}`}
                          size="small"
                          color={allDone ? "success" : "default"}
                          sx={{ fontWeight: 700, flexShrink: 0 }}
                        />
                      </Box>

                      {/* Orders */}
                      <List disablePadding>
                        {g.orders.map((order, idx) => (
                          <React.Fragment key={order.id}>
                            {idx > 0 && <Divider />}
                            <ListItem
                              sx={{
                                px: { xs: 2, sm: 2.5 },
                                py: 1.5,
                                cursor: "pointer",
                                minHeight: 56,
                                userSelect: "none",
                                WebkitTapHighlightColor: "transparent",
                                "&:active": { bgcolor: "action.selected" },
                              }}
                              onClick={() => toggleDone(order.id)}
                            >
                              <Box sx={{ mr: 1.5, display: "flex", alignItems: "center", flexShrink: 0 }}>
                                {order.done ? (
                                  <CheckCircleIcon sx={{ color: "success.main", fontSize: 24 }} />
                                ) : (
                                  <RadioButtonUncheckedIcon sx={{ color: "text.disabled", fontSize: 24 }} />
                                )}
                              </Box>
                              <ListItemText
                                primary={
                                  <Typography
                                    fontWeight={500}
                                    sx={{
                                      textDecoration: order.done ? "line-through" : "none",
                                      color: order.done ? "text.disabled" : "text.primary",
                                      transition: "color 0.2s",
                                    }}
                                  >
                                    {order.drink}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          </React.Fragment>
                        ))}
                      </List>
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* ── MY ORDERS ───────────────────────────────────── */}
        <Typography variant="h5" fontWeight={700} mb={1}>
          Twoje zamówienia
        </Typography>
        {myUserName && (
          <Typography variant="body2" color="text.secondary" mb={3}>
            Zalogowany jako: <strong>{myUserName}</strong>
          </Typography>
        )}

        {loading && myOrderEntries.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : myOrderEntries.length === 0 ? (
          <Paper
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 4, textAlign: "center" }}
          >
            <LocalCafeOutlinedIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1, opacity: 0.5 }} />
            <Typography color="text.secondary">Nie masz jeszcze żadnych zamówień</Typography>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}
          >
            <List disablePadding>
              {myOrderEntries.map(([name, count], idx) => (
                <React.Fragment key={name}>
                  {idx > 0 && <Divider />}
                  <ListItem sx={{ px: { xs: 2, sm: 3 }, py: 2, minHeight: 56 }}>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{name}</Typography>}
                    />
                    <Chip
                      label={`×${count}`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default OrdersPage;

