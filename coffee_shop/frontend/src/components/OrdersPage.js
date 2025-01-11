import React, { Component } from "react";
import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/get-guest-orders")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const groupedOrders = data.orders.reduce((acc, order) => {
          acc[order] = (acc[order] || 0) + 1;
          return acc;
        }, {});
        setUserName(data.userName);
        setOrders(groupedOrders);
      });
  }, []);
  return (
    <div>
      <Typography variant="h4">Orders for {userName}</Typography>
      <List>
        {Object.entries(orders).map(([order, count]) => (
          <ListItem key={order}>
            <ListItemText primary={`${order.drink?.name} x${count}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default OrdersPage;