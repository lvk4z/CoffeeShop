import React, { Component } from "react";
import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const OrdersPage = () => {
  const [orders, setOrders] = useState(new Map());
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/get-guest-orders")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserName(data.userName);
        const map = new Map()
        data.orders.forEach(element => {
          map.set(element.name, (map.get(element.name) || 0) + 1)
        })
        setOrders(map);
        console.log(map)
      });
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