import React, { Component } from "react";
import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const OrdersPage = () => {
  const [orders, setOrders] = useState(new Map());
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let interval = setInterval(() => {
      fetch("/api/get-guest-orders")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Błąd pobierania zamówień");
          }
          return response.json();
        })
        .then((data) => {
          setUserName(data.userName);
          const map = new Map();
          data.orders.forEach((element) => {
            map.set(element.name, (map.get(element.name) || 0) + 1);
          });
          setOrders(map);
        })
        .catch((error) => console.error("Błąd:", error));
    }, 5000); 
    return () => clearInterval(interval);
  }, []);



  return (
    <div>
      <Typography variant="h4">Zamówione przez: {userName}</Typography>
      <List>
        {Array.from(orders.entries()).map(([order, count]) => (
          <ListItem key={order}>
            <ListItemText primary={`x${count}:   ${order} `} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default OrdersPage;